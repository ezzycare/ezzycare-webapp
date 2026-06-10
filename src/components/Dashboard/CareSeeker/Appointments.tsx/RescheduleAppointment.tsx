import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import {
  Appointment,
  useCreateAppointmentMutation,
} from '@/apiQuery/healthcareAppointments/post/createAppointment';
import { useInitializePaymentMutation } from '@/apiQuery/payment/initiatePayment';
import Modal from '@/components/Ui/Modal';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import React, { useEffect, useMemo } from 'react';
import {
  appointmentTypes,
  careModes,
  careTypes,
  paymentMethods,
} from '../BookAppointment';
import BookAppointmentComp from '../BookAppointment/BookAppointmentComp';
import BookOthers from '../BookAppointment/BookOthers';
import SeekerAppointmentPending from '../BookAppointment/SeekerAppointmentPending';
import SelectPaymentMethod from '../BookAppointment/SelectPaymentMethod';

const allStates = [
  'book-appointment',
  'book-others',
  'select-payment',
  'appointment-pending',
];

const ReschedulePatientAppointment = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    state,
    selectedCareType,
    reason,
    promoCode,
    clickedDoctor,
    selectedAppointmentType,
    selectedConsultationType,
    selectedTimes,
    updateBooking,
  } = useBookAppointmentStore();
  const user = useAuthStore((state: AuthStore) => state.user);

  const consultationTypes = careModes.map((item) => item.name);

  const { mutate: initiateBooking, isPending } = useCreateAppointmentMutation();
  const { mutate: initiatePayment, isPending: isPendingPayment } =
    useInitializePaymentMutation();

  const isCreatingBooking = useMemo(() => {
    return isPending || isPendingPayment;
  }, [isPending, isPendingPayment]);

  useEffect(() => {
    if (openModal) {
      updateBooking({ state: 'select-specialty' });
    }
  }, []);

  const modalClassName = useMemo(() => {
    return ['select-payment'].includes(state) ? 'min-h-auto' : 'min-h-[60vh]';
  }, [state]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: clickedDoctor?.id || '',
    });

  const doctor = useMemo(() => {
    return doctorData ? doctorData : ({} as DoctorProfile);
  }, [doctorData]);

  const isLoading = useMemo(() => {
    return loadingSingleDoctor;
  }, [loadingSingleDoctor]);

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
      if (allStates[index - 1] === 'set-filter') {
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
      userServiceId: Number(user.id),
      address: user?.userDetails?.address ?? '',
      city: user?.userDetails?.city ?? '',
      country: user?.userDetails?.country ?? '',
      duration: 30,
    };
    console.log({ payload, user });
    initiateBooking(payload, {
      onSuccess: (res) => {
        console.log({ res });
        toaster.success('Appointment created successfully');
      },
      onError: () => {
        toaster.error('Failed to create appointment');
      },
    });
  };

  const handlePay = (appointment: Appointment) => {
    initiatePayment(
      {
        amount: 0,
        email: user.email,
        appointmentId: appointment.id,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
      {
        onSuccess: (res) => {
          if (res.data?.authorizationUrl) {
            window.location.href = res.data?.authorizationUrl;
            // setState('appointment-pending')
          }
        },
        onError: () => toaster.error('Failed to initialize payment'),
      }
    );
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        size="md"
        className={modalClassName}
        persistent
      >
        <div>
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
            />
          )}

          {state === 'book-others' && (
            <BookOthers
              goBack={() => updateBooking({ state: 'book-appointment' })}
              action={handleCreateAppointment}
            />
          )}

          {state === 'appointment-pending' && (
            <SeekerAppointmentPending
              action={() => {
                updateBooking({ state: 'select-doctor' });
                handleCloseModal();
              }}
            />
          )}

          {state === 'select-payment' && (
            <SelectPaymentMethod
              goBack={() => updateBooking({ state: 'book-appointment' })}
              action={() => updateBooking({ state: 'appointment-pending' })}
              paymentMethods={paymentMethods}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ReschedulePatientAppointment;
