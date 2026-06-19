/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useRescheduleAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/rescheduleAppointment';
import { ConsultationType } from '@/apiQuery/hospital/types';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import ArrowLeft from '@/icons/ArrowLeft';
import { toaster } from '@/lib/toaster';
import { careModes } from '@/modules/careseeker/components/BookAppointment';
import {
  buildBlockedDates,
  buildBlockedTimesByDate,
} from '@/modules/careseeker/components/BookAppointment/BookAppointmentComp';
import { useModalNavigation } from '@/modules/careseeker/hooks/useAppointmentActions';
import DateTimePicker from '@/modules/hospital/components/Agent/BookAppointment/DateTimePicker';
import {
  AppointmentTimes,
  useBookAppointmentStore,
} from '@/stores/bookAppointmentStore';
import { timeSlotGenerator } from '@/utils/timeSlotsGenerator';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';

const allStates = ['book-appointment'];

const DoctorRescheduleAppointment = ({
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
    selectedConsultationType,
    selectedTimes,
    setCreatedAppointment,
    updateBooking,
  } = useBookAppointmentStore();

  const { goBack, modalClassName } = useModalNavigation(allStates);

  const consultationTypes = careModes.map((item) => item.name);

  const { mutate: rescheduleBooking, isPending } =
    useRescheduleAppointmentMutation();

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

  const handleRescheduleAppointment = async () => {
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
        handleCloseModal();
      },
      onError: (error: Error | any) => {
        toaster.error(
          (error?.response?.data?.message ?? error?.message) ||
            'Failed to reschedule appointment'
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
            <DoctorAppRescheduleComp
              doctor={doctor}
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
              goBack={goBack}
              action={handleRescheduleAppointment}
              isLoading={isPending}
              isReschedule={true}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DoctorRescheduleAppointment;

const TIME_INTERVAL = 30; // minutes
const timeSlots = [...timeSlotGenerator(8, 17, TIME_INTERVAL)];

interface BookAppointmentCompParams {
  doctor: DoctorProfile;
  consultationTypes: ConsultationType[];
  selectedConsultationType: ConsultationType;
  setSelectedConsultationType: React.Dispatch<
    React.SetStateAction<ConsultationType>
  >;
  selectedTimes: AppointmentTimes | null;
  setSelectedTimes: React.Dispatch<
    React.SetStateAction<AppointmentTimes | null>
  >;
  action: () => void;
  goBack: () => void;
  isLoading?: boolean;
  isReschedule?: boolean;
}

const DoctorAppRescheduleComp = ({
  doctor,
  consultationTypes,
  selectedConsultationType,
  setSelectedConsultationType,
  selectedTimes,
  setSelectedTimes,
  action,
  goBack,
  isLoading,
  isReschedule = false,
}: BookAppointmentCompParams) => {
  const { createdAppointment } = useBookAppointmentStore();

  const [isSelectingTime, setIsSelectingTime] = useState(false);
  const [currentSelectedTimes, setCurrentSelectedTimes] = useState<{
    date: Date;
    timeSlot: string;
  } | null>(null);
  const [canProceedToPayment, setCanProceedToPayment] = useState(false);

  useEffect(() => {
    if (isReschedule) {
      setIsSelectingTime(true);
    }
  }, [isReschedule]);

  useEffect(() => {
    if (selectedTimes?.appointmentDate) {
      const startTime = selectedTimes.appointmentTime.split(' ')[0];
      const timeSlot = timeSlots.find(
        (timeSlot) => timeSlot.value === startTime
      );
      setCurrentSelectedTimes({
        date: dayjs(selectedTimes.appointmentDate).toDate(),
        timeSlot: timeSlot?.value ?? '',
      });
    }
  }, [selectedTimes]);

  const blockedDates = useMemo(
    () =>
      buildBlockedDates(doctor.availability ?? [], selectedConsultationType),
    [doctor.availability, selectedConsultationType]
  );

  const blockedTimesByDate = useMemo(
    () =>
      buildBlockedTimesByDate(
        doctor.availability ?? [],
        timeSlots,
        selectedConsultationType,
        30
      ),
    [doctor.availability, timeSlots, selectedConsultationType]
  );

  const handleSelectTimes = (val: { date: Date; timeSlot: string }) => {
    setCurrentSelectedTimes(val);
    formatSelectedTime(val);
    setIsSelectingTime(false);
  };

  const formatSelectedTime = ({
    date,
    timeSlot,
  }: {
    date: Date;
    timeSlot: string;
  }) => {
    if (!date || !timeSlot) return;

    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const slot = timeSlots.find((s) => s.value === timeSlot);
    const timeMeridian = slot?.label?.split(' ')[1]?.slice(0, 1);
    const splitSlot = timeSlot?.split(':');

    const startTime = dayjs()
      .hour(Number(splitSlot[0]))
      .minute(Number(splitSlot[1]))
      .format(`HH:mm ${timeMeridian}`);

    const endTime = dayjs()
      .hour(Number(splitSlot[0]))
      .minute(Number(splitSlot[1]))
      .add(30, 'minute')
      .format(`HH:mm ${timeMeridian}`);

    setSelectedTimes({
      appointmentDate: formattedDate,
      appointmentTime: startTime,
      appointmentEndTime: endTime,
    });
  };

  const isValid = useMemo(() => {
    return (
      selectedTimes?.appointmentDate &&
      selectedTimes?.appointmentTime &&
      selectedTimes?.appointmentEndTime
    );
  }, [selectedTimes]);

  return (
    <div className="flex flex-col">
      <div
        className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
        onClick={goBack}
      >
        <ArrowLeft />
        <p className="text-sm font-medium">Back</p>
      </div>

      <div className="flex flex-col space-y-3">
        <h3 className="text-base text-text-alt font-medium">
          Reschedule Appointment
        </h3>

        <div>
          <p className="text-sm text-text font-semibold">Consultation type</p>

          <div className="flex items-center gap-5.75 mt-2">
            {consultationTypes.map((type) => (
              <div
                key={type}
                className={`flex items-center gap-2 ${isReschedule ? 'pointer-events-none opacity-70' : ''}`}
              >
                <RadioItem
                  name="consultationTypes"
                  checked={selectedConsultationType === type}
                  option={{ value: type }}
                  onChange={() => setSelectedConsultationType(type)}
                />
                <p className="text-sm text-text-alt hover:text-text capitalize cursor-pointer">
                  {type?.toLowerCase()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DateTimePicker
          interval={TIME_INTERVAL}
          blockedDates={blockedDates}
          timeSlots={timeSlots}
          blockedTimesByDate={blockedTimesByDate}
          defaultDate={currentSelectedTimes?.date}
          onSelect={handleSelectTimes}
          applyImmediately={true}
        />

        {(!canProceedToPayment || !createdAppointment) && (
          <>
            {(isReschedule || !isSelectingTime) && (
              <Button
                variant="primary"
                className="py-2.5! w-full"
                disabled={!isValid || isLoading}
                loading={isLoading}
                onClick={() => {
                  action();
                }}
              >
                Reschedule Appointment
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
