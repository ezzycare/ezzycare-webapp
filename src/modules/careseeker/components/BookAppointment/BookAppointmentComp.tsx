/* eslint-disable react-hooks/set-state-in-effect */
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { ConsultationType } from '@/apiQuery/hospital/types';
import Button from '@/components/Ui/Button';
import { RadioItem } from '@/components/Ui/RadioGroup';
import TextArea from '@/components/Ui/TextArea';
import { TextInput } from '@/components/Ui/TextInput';
import ArrowLeft from '@/icons/ArrowLeft';
import DateTimePicker, {
  SelectedSlotDisplay,
} from '@/modules/hospital/components/Agent/BookAppointment/DateTimePicker';
import DoctorCard from '@/modules/hospital/components/Agent/BookAppointment/DoctorCard';
import {
  AppointmentTimes,
  useBookAppointmentStore,
} from '@/stores/bookAppointmentStore';
import { formatCurrency } from '@/utils/helper';
import { timeSlotGenerator } from '@/utils/timeSlotsGenerator';
import dayjs from 'dayjs';
import { CircleDollarSign } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

const TIME_INTERVAL = 30; // minutes
const timeSlots = [...timeSlotGenerator(8, 17, TIME_INTERVAL)];

interface BookAppointmentCompParams {
  doctor: DoctorProfile;
  reason: string;
  setReason: React.Dispatch<React.SetStateAction<string>>;
  promoCode: string;
  setPromoCode: React.Dispatch<React.SetStateAction<string>>;
  consultationTypes: ConsultationType[];
  selectedConsultationType: ConsultationType;
  setSelectedConsultationType: React.Dispatch<
    React.SetStateAction<ConsultationType>
  >;
  selectedTimes: AppointmentTimes | null;
  setSelectedTimes: React.Dispatch<
    React.SetStateAction<AppointmentTimes | null>
  >;
  selectedAppointmentType: 0 | 1;
  setSelectedAppointmentType: (value: 0 | 1) => void;
  appointmentTypes: { id: 0 | 1; name: string }[];
  action: () => void;
  goBack: () => void;
  isLoading?: boolean;
  isReschedule?: boolean;
  proceedToPayment: () => void;
  cancelAppointment: () => void;
}

const BookAppointmentComp = ({
  doctor,
  reason,
  setReason,
  promoCode,
  setPromoCode,
  consultationTypes,
  selectedConsultationType,
  setSelectedConsultationType,
  selectedTimes,
  setSelectedTimes,
  selectedAppointmentType,
  setSelectedAppointmentType,
  appointmentTypes,
  action,
  goBack,
  isLoading,
  isReschedule = false,
  proceedToPayment,
  cancelAppointment,
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

  const getConsultationFee = useMemo(() => {
    const charges = {
      HOME: doctor.userDetails?.homeConsultationCharge,
      VIDEO: doctor.userDetails?.videoConsultationCharge,
      CLINIC: doctor.userDetails?.clinicConsultationCharge,
    };

    if (!selectedConsultationType) {
      return '';
    }

    const retrieved = charges[selectedConsultationType as ConsultationType];

    if (!retrieved) {
      return '';
    }

    return `${formatCurrency(retrieved * TIME_INTERVAL)}/${TIME_INTERVAL} mins`;
  }, [doctor, selectedConsultationType]);

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
      selectedTimes?.appointmentEndTime &&
      selectedConsultationType &&
      reason?.length > 0
    );
  }, [selectedTimes, selectedConsultationType, reason]);

  return (
    <div className="flex flex-col">
      {!isReschedule && (
        <div
          className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
          onClick={goBack}
        >
          <ArrowLeft />
          <p className="text-sm font-medium">Back</p>
        </div>
      )}

      <div className="flex flex-col space-y-3">
        <h3 className="text-base text-text-alt font-medium">
          {isReschedule ? 'Reschedule' : 'Book'} Appointment
        </h3>
        <DoctorCard key={doctor.id} doctor={doctor} />

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

        {isSelectingTime ? (
          <div>
            <DateTimePicker
              interval={TIME_INTERVAL}
              blockedDates={blockedDates}
              timeSlots={timeSlots}
              blockedTimesByDate={blockedTimesByDate}
              defaultDate={currentSelectedTimes?.date}
              onSelect={handleSelectTimes}
              applyImmediately={!isReschedule}
              applyLabel={isReschedule ? 'Proceed' : 'Apply'}
            />
          </div>
        ) : (
          <>
            {(!canProceedToPayment || !createdAppointment) && (
              <Button
                variant="outline"
                className="text-base py-2.5! w-full border-primary text-blue-11!"
                onClick={() => setIsSelectingTime(true)}
              >
                {currentSelectedTimes
                  ? 'Pick a different session'
                  : 'Select appointment time'}
              </Button>
            )}
            {currentSelectedTimes && (
              <SelectedSlotDisplay
                interval={TIME_INTERVAL}
                slots={timeSlots}
                selectedDate={currentSelectedTimes.date}
                selectedSlot={currentSelectedTimes.timeSlot}
                className="bg-blue-3a text-blue-11 shadow-none!"
              />
            )}

            {selectedConsultationType && (
              <div
                className="flex items-center justify-between gap-2 text-pink-12a
                text-xs w-full px-4 sm:px-9 py-4.5 bg-pink-3a rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={16} />
                  <p>Consultation Fee</p>
                </div>
                <p>{getConsultationFee}</p>
              </div>
            )}
            {(!canProceedToPayment || !createdAppointment) && (
              <div className="w-full">
                <p className="text-base text-text font-semibold">Reason</p>
                <TextArea
                  value={reason ?? createdAppointment?.reason ?? ''}
                  placeholder="Please state reason including any symptoms"
                  className="mt-2 min-h-38.25!"
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                />
              </div>
            )}

            {canProceedToPayment && (
              <div>
                <p className="text-sm text-text font-semibold">
                  Appointment Type
                </p>

                <div
                  className={`flex items-center gap-5.75 mt-2 ${isReschedule ? 'pointer-events-none opacity-70' : ''}`}
                >
                  {appointmentTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <RadioItem
                        name="consultationTypes"
                        checked={selectedAppointmentType === type.id}
                        option={{ value: type.name }}
                        onChange={() => setSelectedAppointmentType(type.id)}
                      />
                      <p className="text-sm text-text-alt hover:text-text capitalize cursor-pointer">
                        {type?.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {(!canProceedToPayment || !createdAppointment) && (
          <>
            {!isReschedule && (
              <div className="w-full">
                <p className="text-base text-text font-semibold">
                  Promocode (optional)
                </p>
                <TextInput
                  value={promoCode}
                  placeholder="Enter promo code"
                  className="mt-2"
                  disabled={isReschedule}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
              </div>
            )}

            {(isReschedule || !isSelectingTime) && (
              <Button
                variant="primary"
                className="py-2.5! w-full"
                disabled={!isValid || isLoading}
                loading={isLoading}
                onClick={() => {
                  action();
                  setCanProceedToPayment(true);
                }}
              >
                {isReschedule ? 'Reschedule' : 'Book'} Appointment
              </Button>
            )}
          </>
        )}
        {canProceedToPayment && !!createdAppointment && (
          <div className="space-y-2">
            <Button
              variant="primary"
              className="py-2.5! w-full"
              disabled={!isValid || isLoading}
              loading={isLoading}
              onClick={() => {
                proceedToPayment();
              }}
            >
              Proceed to Payment
            </Button>
            <Button
              variant="outline"
              className="py-2.5! w-full"
              disabled={!isValid || isLoading}
              onClick={() => {
                cancelAppointment();
                setCanProceedToPayment(false);
              }}
            >
              Cancel Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentComp;

type Availability = {
  day: string;
  slots: {
    startTime: string;
    endTime: string;
    consultationType: string;
  }[];
};

type TimeSlot = {
  label: string;
  value: string;
};

export const buildBlockedDates = (
  availability: Availability[],
  consultationType: ConsultationType,
  numberOfDays = 90
): Date[] => {
  const availableDays = new Set(
    availability
      .filter(
        (item) =>
          item.slots.length > 0 &&
          item.slots[0].consultationType === consultationType
      )
      .map((item) => item.day.toUpperCase())
  );

  const blockedDates: Date[] = [];

  for (let i = 0; i < numberOfDays; i++) {
    const date = dayjs().add(i, 'day');

    if (!availableDays.has(date.format('dddd').toUpperCase())) {
      blockedDates.push(date.toDate());
    }
  }

  return blockedDates;
};

export const buildBlockedTimesByDate = (
  availability: Availability[],
  timeSlots: TimeSlot[],
  consultationType: ConsultationType,
  numberOfDays = 90
) => {
  const result: Record<string, string[]> = {};

  for (let i = 0; i < numberOfDays; i++) {
    const date = dayjs().add(i, 'day');
    const weekday = date.format('dddd').toUpperCase();

    const dayAvailability = availability.find(
      (item) => item.day.toUpperCase() === weekday
    );

    const availableTimes = new Set<string>();

    if (dayAvailability) {
      dayAvailability.slots.forEach((slot) => {
        timeSlots.forEach((timeSlot) => {
          if (
            slot.consultationType === consultationType &&
            timeSlot.value >= slot.startTime &&
            timeSlot.value < slot.endTime
          ) {
            availableTimes.add(timeSlot.value);
          }
        });
      });
    }

    result[date.format('YYYY-MM-DD')] = timeSlots
      .filter((slot) => !availableTimes.has(slot.value))
      .map((slot) => slot.value);
  }

  return result;
};
