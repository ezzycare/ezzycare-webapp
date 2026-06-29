/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Doctor,
  useGetDoctorsDiscoveryQuery,
} from '@/apiQuery/doctor/getDoctorDiscovery';
import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import { useCancelAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import {
  CreateAppointmentInterface,
  useCreateAppointmentMutation,
} from '@/apiQuery/healthcareAppointments/post/createAppointment';
import { ConsultationType } from '@/apiQuery/hospital/types';
import { ApiResponse } from '@/apiQuery/types';
import Modal from '@/components/Ui/Modal';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toaster } from '@/lib/toaster';
import {
  useModalNavigation,
  usePaymentHandlers,
} from '@/modules/careseeker/hooks/useAppointmentActions';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import React, { useEffect, useMemo } from 'react';
import AllDoctorsComp from './AllDoctorsComp';
import BookAppointmentComp from './BookAppointmentComp';
import BookOthers from './BookOthers';
import DoctorFilter from './DoctorFilter';
import SeekerAppointmentPending from './SeekerAppointmentPending';
import SelectDoctorSpecialty from './SelectDoctorSpecialty';
import SelectPatientCareMode from './SelectPatientCareMode';
import SelectPatientCareType from './SelectPatientCareType';
import SelectPaymentMethod from './SelectPaymentMethod';
import {
  appointmentTypes,
  careModes,
  careTypes,
  paymentMethods,
} from './constants';

export type { PaymentMethodType } from './constants';

const allStates = [
  'select-specialty',
  'select-care-type',
  'select-care-mode',
  'select-doctor',
  'set-filter',
  'book-appointment',
  'book-others',
  'select-payment',
  'appointment-pending',
];

const BookDoctorAppointment = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    state,
    selectedCareType,
    selectedCareMode,
    reason,
    promoCode,
    clickedDoctor,
    selectedAppointmentType,
    selectedConsultationType,
    selectedTimes,
    activeFilters,
    createdAppointment,
    hospitalId,
    isHospitalAppointment,
    updateBooking,
    setCreatedAppointment,
    resetBookingFlow,
    resetHospitalFlow,
    resetPaymentState,
  } = useBookAppointmentStore();
  const user = useAuthStore((state: AuthStore) => state.user);

  const { handlePayment, isPendingPayment, isPendingWalletPayment } =
    usePaymentHandlers();
  const { goBack, modalClassName } = useModalNavigation(allStates);

  const consultationTypes = careModes.map((item) => item.name);

  const { mutate: initiateBooking, isPending } = useCreateAppointmentMutation();
  const { mutate: cancelAppointment, isPending: isPendingCancel } =
    useCancelAppointmentMutation();

  const isCreatingBooking = useMemo(() => {
    return (
      isPending || isPendingPayment || isPendingWalletPayment || isPendingCancel
    );
  }, [isPending, isPendingPayment, isPendingWalletPayment, isPendingCancel]);

  const showModalHeader = useMemo(
    () =>
      ![
        'select-doctor',
        'set-filter',
        'book-appointment',
        'book-others',
        'select-payment',
        'appointment-pending',
      ].includes(state),
    [state]
  );

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories?.doctors?.children
  );

  const specialties = useMemo(() => {
    return categories?.length ? categories : [];
  }, [categories]);

  const doctorFilters = useMemo(() => {
    const filters = { ...activeFilters };

    if (!filters.distance || filters.distance === 0) {
      delete filters.distance;
      delete filters.latitude;
      delete filters.longitude;
    } else if (filters.latitude == null || filters.longitude == null) {
      delete filters.distance;
    }

    return filters;
  }, [activeFilters]);

  const {
    doctors: doctorsData,
    isFetching: loadingDoctors,
    ...restDoctorQueries
  } = useGetDoctorsDiscoveryQuery(doctorFilters);

  const doctors: Doctor[] = useMemo(() => {
    return doctorsData?.filter((doctor): doctor is Doctor => !!doctor) ?? [];
  }, [doctorsData]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: clickedDoctor?.id ? Number(clickedDoctor.id) : null,
    });

  const doctor: DoctorProfile | null | undefined = doctorData;

  const isLoading = useMemo(() => {
    return loadingDoctors || loadingSingleDoctor;
  }, [loadingDoctors, loadingSingleDoctor]);

  const selectedSpecialtyFromFilter = useMemo(() => {
    if (!activeFilters.categoryId) return 'all';
    return (
      specialties.find((c) => Number(c.id) === activeFilters.categoryId)
        ?.name ?? 'all'
    );
  }, [activeFilters.categoryId, specialties]);

  const selectedCareModeFromFilter = useMemo(() => {
    return activeFilters.type ?? selectedCareMode;
  }, [activeFilters.type, selectedCareMode]);

  const {
    latitude,
    longitude,
    hasLocation,
    permissionGranted,
    requestPermission,
  } = useGeolocation();

  useEffect(() => {
    if (state === 'select-doctor' && !permissionGranted) {
      requestPermission();
    }
  }, [state, permissionGranted, requestPermission]);

  useEffect(() => {
    if (
      hasLocation &&
      latitude != null &&
      longitude != null &&
      activeFilters.distance == null
    ) {
      updateBooking({
        activeFilters: {
          ...activeFilters,
          latitude,
          longitude,
          distance: 100,
        },
      });
    }
  }, [hasLocation, latitude, longitude]);

  const cleanUp = () => {
    resetBookingFlow();
    resetHospitalFlow();
  };

  const handleResetModal = () => {
    updateBooking({
      state: 'select-specialty',
    });
    cleanUp();
    resetPaymentState();
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    if (state === 'set-filter') {
      updateBooking({ state: 'select-doctor' });
    } else {
      handleResetModal();
    }
  };

  const handleCreateAppointment = (
    otherUserData?: OtherUserData
  ): Promise<CreateAppointmentInterface> => {
    return new Promise((resolve, reject) => {
      if (!doctor?.id) {
        reject(new Error('No doctor selected'));
        return;
      }
      const hospitalDetail =
        isHospitalAppointment && hospitalId ? { hospitalId } : {};
      const payload = {
        userId: Number(doctor.id),
        ...hospitalDetail,
        myAppointment: selectedAppointmentType,
        appointmentType: selectedConsultationType,
        urgent: careTypes[selectedCareType].id,
        name:
          otherUserData?.fullName ??
          `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim(),
        email: otherUserData?.email ?? user?.email ?? '',
        mobileNo: otherUserData?.phone ?? user?.mobileNo ?? '',
        age: otherUserData?.age ?? '',
        gender: otherUserData?.gender ?? user?.gender ?? '',
        reason: otherUserData?.reason ?? reason ?? '',
        appointmentDate: selectedTimes?.appointmentDate ?? '',
        appointmentTime: selectedTimes?.appointmentTime ?? '',
        appointmentEndTime: selectedTimes?.appointmentEndTime ?? '',
        address: otherUserData?.address ?? user?.userDetails?.address ?? '',
        city: otherUserData?.city ?? user?.userDetails?.city ?? '',
        country: user?.userDetails?.country ?? '',
        duration: 30,
      };

      initiateBooking(payload, {
        onSuccess: (res: ApiResponse<CreateAppointmentInterface>) => {
          if (!res.data) {
            reject(new Error('No appointment data returned'));
            return;
          }

          setCreatedAppointment(res.data);
          toaster.success(res.message || 'Appointment created successfully');

          resolve(res.data);
        },
        onError: (error: any) => {
          const message = error?.message || 'Failed to create appointment';
          setCreatedAppointment(null);
          toaster.error(message);
          reject(error);
        },
      });
    });
  };

  const handleCancelAppointment = (reason: string) => {
    if (!createdAppointment?.id) return;
    cancelAppointment(
      {
        id: createdAppointment.id!,
        reason,
      },
      {
        onSuccess: () => {
          handleCloseModal();
        },
      }
    );
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={showModalHeader ? 'Book Appointment' : ''}
        description={showModalHeader ? 'Book an appointment with ease' : ''}
        size="md"
        className={modalClassName}
        persistent
      >
        <div>
          {state === 'select-specialty' && (
            <SelectDoctorSpecialty
              specialties={specialties}
              selectedSpecialty={selectedSpecialtyFromFilter}
              setSelectedSpecialty={(value) => {
                const resolved =
                  typeof value === 'function'
                    ? value(selectedSpecialtyFromFilter)
                    : value;
                const specialtyId =
                  resolved !== 'all'
                    ? specialties.find((category) => category.name === resolved)
                        ?.id
                    : undefined;
                updateBooking({
                  selectedSpecialty: resolved,
                  activeFilters: {
                    ...activeFilters,
                    categoryId: specialtyId ? Number(specialtyId) : undefined,
                  },
                });
              }}
              action={() => updateBooking({ state: 'select-care-type' })}
            />
          )}
          {state === 'select-care-type' && (
            <SelectPatientCareType
              careTypes={careTypes}
              selectedCareType={selectedCareType}
              setSelectedCareType={(value) => {
                const resolved =
                  typeof value === 'function' ? value(selectedCareType) : value;
                updateBooking({
                  selectedCareType: resolved,
                });
              }}
              action={() => updateBooking({ state: 'select-care-mode' })}
            />
          )}
          {state === 'select-care-mode' && (
            <SelectPatientCareMode
              careModes={careModes}
              selectedCareMode={selectedCareModeFromFilter}
              setSelectedCareMode={(value) => {
                const resolved =
                  typeof value === 'function'
                    ? value(selectedCareModeFromFilter)
                    : value;
                updateBooking({
                  selectedCareMode: resolved,
                  activeFilters: {
                    ...activeFilters,
                    type: resolved as ConsultationType,
                  },
                });
              }}
              action={() => updateBooking({ state: 'select-doctor' })}
            />
          )}
          {state === 'select-doctor' && (
            <AllDoctorsComp
              isLoading={isLoading}
              doctors={doctors}
              firstPageItems={
                restDoctorQueries.data?.pages?.[0]?.data?.items as
                  | Doctor[]
                  | undefined
              }
              selectedDoctor={doctor!}
              hasNextPage={restDoctorQueries.hasNextPage}
              fetchNextPage={restDoctorQueries.fetchNextPage}
              isFetchingNextPage={restDoctorQueries.isFetchingNextPage}
              filters={activeFilters}
              setFilters={(value) =>
                updateBooking({
                  activeFilters:
                    typeof value === 'function' ? value(activeFilters) : value,
                })
              }
              clickedDoctor={clickedDoctor}
              setClickedDoctor={(value) =>
                updateBooking({
                  clickedDoctor:
                    typeof value === 'function' ? value(clickedDoctor) : value,
                })
              }
              openFilter={() => updateBooking({ state: 'set-filter' })}
              action={() => updateBooking({ state: 'book-appointment' })}
              goBack={goBack}
            />
          )}
          {state === 'set-filter' && (
            <DoctorFilter
              specialties={specialties}
              careTypes={careTypes}
              careModes={careModes}
              filters={activeFilters}
              setFilters={(value) =>
                updateBooking({
                  activeFilters:
                    typeof value === 'function' ? value(activeFilters) : value,
                })
              }
              goBack={goBack}
            />
          )}

          {state === 'book-appointment' && doctor && (
            <BookAppointmentComp
              doctor={doctor!}
              reason={reason}
              setReason={(value) =>
                updateBooking({
                  reason: typeof value === 'function' ? value(reason) : value,
                })
              }
              promoCode={promoCode}
              setPromoCode={(value) =>
                updateBooking({
                  promoCode:
                    typeof value === 'function' ? value(promoCode) : value,
                })
              }
              consultationTypes={consultationTypes}
              selectedConsultationType={selectedConsultationType}
              setSelectedConsultationType={(value) =>
                updateBooking({
                  selectedConsultationType:
                    typeof value === 'function'
                      ? value(selectedConsultationType)
                      : value,
                })
              }
              selectedTimes={selectedTimes}
              setSelectedTimes={(value) =>
                updateBooking({
                  selectedTimes:
                    typeof value === 'function' ? value(selectedTimes) : value,
                })
              }
              selectedAppointmentType={selectedAppointmentType}
              setSelectedAppointmentType={(value: 0 | 1) => {
                updateBooking({ selectedAppointmentType: value });
                if (value === 1) {
                  updateBooking({ state: 'book-others' });
                }
              }}
              appointmentTypes={appointmentTypes}
              goBack={goBack}
              action={handleCreateAppointment}
              isLoading={isCreatingBooking}
              proceedToPayment={() => {
                if (!createdAppointment) {
                  return;
                }
                updateBooking({ state: 'select-payment' });
              }}
              cancelAppointment={() => handleCancelAppointment(reason)}
            />
          )}

          {state === 'book-others' && (
            <BookOthers
              isLoading={isCreatingBooking}
              goBack={() => updateBooking({ state: 'book-appointment' })}
              action={(othersData: OtherUserData) =>
                handleCreateAppointment(othersData)
              }
            />
          )}

          {state === 'appointment-pending' && (
            <SeekerAppointmentPending
              action={() => {
                handleCloseModal();
              }}
            />
          )}
          {state === 'select-payment' && (
            <SelectPaymentMethod
              goBack={() => updateBooking({ state: 'book-appointment' })}
              action={(paymentMethod: string) => handlePayment(paymentMethod)}
              isLoading={isCreatingBooking}
              paymentMethods={paymentMethods}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookDoctorAppointment;

export interface OtherUserData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  gender: 'MALE' | 'FEMALE' | null;
  age: string | null;
  address: string | null;
  city: string | null;
  reason: string | null;
  promoCode: string | null;
}
