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
import { BoldWalletIcon, PaypalIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import React, { JSX, useEffect, useMemo } from 'react';
import {
  useModalNavigation,
  usePaymentHandlers,
} from '@/modules/careseeker/hooks/useAppointmentActions';
import AllDoctorsComp from './AllDoctorsComp';
import BookAppointmentComp from './BookAppointmentComp';
import BookOthers from './BookOthers';
import DoctorFilter from './DoctorFilter';
import SeekerAppointmentPending from './SeekerAppointmentPending';
import SelectDoctorSpecialty from './SelectDoctorSpecialty';
import SelectPatientCareMode from './SelectPatientCareMode';
import SelectPatientCareType from './SelectPatientCareType';
import SelectPaymentMethod from './SelectPaymentMethod';

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

const BookPatientAppointment = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    state,
    selectedSpecialty,
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
    updateBooking,
    setCreatedAppointment,
    updatePaymentReference,
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

  useEffect(() => {
    if (openModal) {
      updateBooking({ state: 'select-specialty' });
    }
  }, []);

  const showModalHeader = useMemo(
    () =>
      ![
        'select-doctor',
        'set-filter',
        'book-appointment',
        'book-others',
        'select-payment',
      ].includes(state),
    [state]
  );

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories?.doctors?.children
  );

  const specialties = useMemo(() => {
    return categories?.length ? categories : [];
  }, [categories]);

  const {
    doctors: doctorsData,
    isFetching: loadingDoctors,
    ...restDoctorQueries
  } = useGetDoctorsDiscoveryQuery({ ...activeFilters });

  const doctors: Doctor[] = useMemo(() => {
    return doctorsData?.filter((doctor): doctor is Doctor => !!doctor) ?? [];
  }, [doctorsData]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: clickedDoctor?.id || '',
    });

  const doctor = useMemo(() => {
    return doctorData ? doctorData : ({} as DoctorProfile);
  }, [doctorData]);

  const isLoading = useMemo(() => {
    return loadingDoctors || loadingSingleDoctor;
  }, [loadingDoctors, loadingSingleDoctor]);

  const handleResetModal = () => {
    updateBooking({
      state: 'select-specialty',
      selectedSpecialty: '',
      selectedCareType: 0,
      selectedCareMode: '',
      clickedDoctor: null,
      activeFilters: {},
    });
    setOpenModal(false);
    setCreatedAppointment(null);
    updatePaymentReference(null);
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
      const payload = {
        userId: Number(doctor.id),
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
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={(value) =>
                updateBooking({
                  selectedSpecialty:
                    typeof value === 'function'
                      ? value(selectedSpecialty)
                      : value,
                })
              }
              action={() => updateBooking({ state: 'select-care-type' })}
            />
          )}
          {state === 'select-care-type' && (
            <SelectPatientCareType
              careTypes={careTypes}
              selectedCareType={selectedCareType}
              setSelectedCareType={(value) =>
                updateBooking({
                  selectedCareType:
                    typeof value === 'function'
                      ? value(selectedCareType)
                      : value,
                  activeFilters: {
                    categoryId: selectedCareType,
                  },
                })
              }
              action={() => updateBooking({ state: 'select-care-mode' })}
            />
          )}
          {state === 'select-care-mode' && (
            <SelectPatientCareMode
              careModes={careModes}
              selectedCareMode={selectedCareMode}
              setSelectedCareMode={(value) =>
                updateBooking({
                  selectedCareMode:
                    typeof value === 'function'
                      ? value(selectedCareMode)
                      : value,
                  activeFilters: {
                    type: selectedCareMode as ConsultationType,
                  },
                })
              }
              action={() => updateBooking({ state: 'select-doctor' })}
            />
          )}
          {state === 'select-doctor' && (
            <AllDoctorsComp
              isLoading={isLoading}
              doctors={doctors}
              selectedDoctor={doctor}
              hasNextPage={restDoctorQueries.hasNextPage}
              fetchNextPage={restDoctorQueries.fetchNextPage}
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

          {state === 'book-appointment' && (
            <BookAppointmentComp
              doctor={doctor}
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

export default BookPatientAppointment;

export const careTypes: { id: 0 | 1; name: string }[] = [
  { id: 0, name: 'Non-Urgent Care' },
  { id: 1, name: 'Urgent Care' },
];
export const careModes: { id: number; name: ConsultationType }[] = [
  { id: 0, name: 'VIDEO' },
  { id: 1, name: 'HOME' },
  { id: 2, name: 'CLINIC' },
];
export const appointmentTypes: { id: 0 | 1; name: string }[] = [
  { id: 1, name: 'Self' },
  { id: 0, name: 'Others' },
];

export type PaymentMethodType = {
  id: number;
  slug: string;
  name: string;
  icon: JSX.Element;
};

export const paymentMethods: PaymentMethodType[] = [
  {
    id: 0,
    slug: 'wallet',
    name: 'Pay from wallet',
    icon: <BoldWalletIcon />,
  },
  {
    id: 1,
    slug: 'online',
    name: 'Pay Online',
    icon: <PaypalIconLocal />,
  },
];

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
