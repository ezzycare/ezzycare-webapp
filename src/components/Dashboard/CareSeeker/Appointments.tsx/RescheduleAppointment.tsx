/* eslint-disable @typescript-eslint/no-explicit-any */
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useRescheduleAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/rescheduleAppointment';
import Modal from '@/components/Ui/Modal';
import { toaster } from '@/lib/toaster';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import React, { useEffect, useMemo } from 'react';
import {
  appointmentTypes,
  careModes,
  paymentMethods,
} from '../BookAppointment';
import BookAppointmentComp from '../BookAppointment/BookAppointmentComp';
import BookOthers from '../BookAppointment/BookOthers';
import SeekerAppointmentPending from '../BookAppointment/SeekerAppointmentPending';
import SelectPaymentMethod from '../BookAppointment/SelectPaymentMethod';
import {
  useModalNavigation,
  usePaymentHandlers,
} from '../hooks/useAppointmentActions';

const allStates = [
  'book-appointment',
  'book-others',
  'select-payment',
  'appointment-pending',
];

const ReschedulePatientAppointment = ({
  appointment,
  doctor,
  openModal,
  setOpenModal,
}: {
  appointment: any;
  doctor: DoctorProfile;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    state,
    reason,
    promoCode,
    selectedAppointmentType,
    selectedConsultationType,
    selectedTimes,
    createdAppointment,
    setCreatedAppointment,
    updateBooking,
  } = useBookAppointmentStore();
  const { handlePayment, isPendingPayment, isPendingWalletPayment } =
    usePaymentHandlers();
  const { goBack, modalClassName } = useModalNavigation(allStates);

  const consultationTypes = careModes.map((item) => item.name);

  const { mutate: rescheduleBooking, isPending } =
    useRescheduleAppointmentMutation();

  const isCreatingBooking = useMemo(() => {
    return isPending || isPendingPayment || isPendingWalletPayment;
  }, [isPending, isPendingPayment, isPendingWalletPayment]);

  useEffect(() => {
    updateBooking({ state: 'book-appointment' });
  }, []);

  const handleCloseModal = () => {
    updateBooking({
      state: 'book-appointment',
      selectedSpecialty: '',
      selectedCareType: 0,
      selectedCareMode: '',
    });
    setOpenModal(false);
  };

  const handleCreateAppointment = async () => {
    const payload = {
      id: Number(appointment?.id),
      appointmentDate: selectedTimes?.appointmentDate ?? '',
      appointmentTime: selectedTimes?.appointmentTime ?? '',
      appointmentEndTime: selectedTimes?.appointmentEndTime ?? '',
    };
    rescheduleBooking(payload, {
      onSuccess: (res) => {
        if (res?.data) {
          setCreatedAppointment(res.data);
        }
        toaster.success(res.message || 'Appointment rescheduled successfully');
      },
      onError: (error: Error | any) => {
        toaster.error(
          (error?.response?.data?.message ?? error?.message) ||
            'Failed to create appointment'
        );
      },
    });
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
        <div className="">
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
              isReschedule={true}
              proceedToPayment={() => {
                if (!createdAppointment) {
                  return;
                }
                updateBooking({ state: 'select-payment' });
              }}
              cancelAppointment={() =>
                updateBooking({ state: 'book-appointment' })
              }
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

export default ReschedulePatientAppointment;
