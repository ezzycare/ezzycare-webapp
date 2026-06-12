/* eslint-disable @typescript-eslint/no-explicit-any */
import { appUrl } from '@/apiQuery/baseUrl';
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
import {
  PaymentParams,
  useInitializePaymentMutation,
} from '@/apiQuery/payment/initiatePayment';
import { usePayWithWalletMutation } from '@/apiQuery/payment/payWithWallet';
import { ApiResponse } from '@/apiQuery/types';
import Modal from '@/components/Ui/Modal';
import { BoldWalletIcon, PaypalIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import React, { JSX, useEffect, useMemo } from 'react';
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
    paymentReference,
    updatePaymentReference,
  } = useBookAppointmentStore();
  const user = useAuthStore((state: AuthStore) => state.user);

  const consultationTypes = careModes.map((item) => item.name);

  const { mutate: initiateBooking, isPending } = useCreateAppointmentMutation();
  const { mutate: initiatePayment, isPending: isPendingPayment } =
    useInitializePaymentMutation();
  const { mutate: initiateWalletPayment, isPending: isPendingWalletPayment } =
    usePayWithWalletMutation();
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

  const modalClassName = useMemo(() => {
    return ['select-payment'].includes(state)
      ? 'min-h-auto'
      : 'min-h-[60vh] max-h-[90vh] overflow-y-auto';
  }, [state]);

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
    setCreatedAppointment(null);
    setOpenModal(false);
  };

  const handleCloseModal = () => {
    if (state === 'set-filter') {
      updateBooking({ state: 'select-doctor' });
    } else {
      handleResetModal();
    }
  };

  const goBack = () => {
    const index = allStates.findIndex((item) => item === state);
    if (index > 0) {
      if (['set-filter'].includes(allStates[index - 1])) {
        updateBooking({ state: allStates[index - 2] });
        return;
      }
      updateBooking({ state: allStates[index - 1] });
    }
  };

  const handleCreateAppointment = async () => {
    const payload = {
      userId: Number(doctor.id),
      // hospitalId: null,
      myAppointment: selectedAppointmentType,
      appointmentType: selectedConsultationType,
      urgent: careTypes[selectedCareType].id,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      mobileNo: user?.mobileNo,
      age: '',
      gender: user.gender,
      reason,
      appointmentDate: selectedTimes?.appointmentDate ?? '',
      appointmentTime: selectedTimes?.appointmentTime ?? '',
      appointmentEndTime: selectedTimes?.appointmentEndTime ?? '',
      // userServiceId: Number(user.id),
      address: user?.userDetails?.address ?? '',
      city: user?.userDetails?.city ?? '',
      country: user?.userDetails?.country ?? '',
      duration: 30,
    };
    console.log({ payload, user });
    initiateBooking(payload, {
      onSuccess: (res: ApiResponse<CreateAppointmentInterface>) => {
        console.log({ res: res.data });
        if (!res.data) return;
        setCreatedAppointment(res.data);
        toaster.success(res.message || 'Appointment created successfully');
      },
      onError: (error: Error | any) => {
        toaster.error(error?.message || 'Failed to create appointment');
      },
    });
  };

  const handlePayment = (paymentMethod: string) => {
    if (!createdAppointment) return;

    const payload = {
      amount: createdAppointment.totalCharge,
      email: createdAppointment.email,
      appointmentId: Number(createdAppointment.id),
      callbackUrl: `${appUrl}/dashboard?paymentCallback=true`,
    };

    if (paymentMethod === 'wallet') {
      handleWalletPayment(payload);
    } else {
      handleOnlinePayment(payload);
    }
  };

  const handleWalletPayment = (payload: PaymentParams) => {
    initiateWalletPayment(payload, {
      onSuccess: (res) => {
        console.log({ paymentWithWalletRes: res });
        updateBooking({ state: 'appointment-pending' });
      },
      onError: (error: Error | any) => {
        toaster.error(error?.message || 'Failed to initialize payment');
      },
    });
  };
  const handleOnlinePayment = (payload: PaymentParams) => {
    initiatePayment(payload, {
      onSuccess: (res) => {
        console.log({ paymentWithWalletRes: res });
        if (res.data?.data?.authorization_url) {
          updatePaymentReference(res.data?.data);
          window.location.href = res.data?.data?.authorization_url;
        }
        // updateBooking({ state: 'appointment-pending' });
      },
      onError: (error: Error | any) => {
        toaster.error(error?.message || 'Failed to initialize payment');
      },
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
              goBack={() => updateBooking({ state: 'book-appointment' })}
              action={handleCreateAppointment}
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

          {state === 'appointment-pending' && (
            <SeekerAppointmentPending
              action={() => {
                handleCloseModal();
              }}
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
