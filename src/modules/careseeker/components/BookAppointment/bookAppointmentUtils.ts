import { ConsultationType } from '@/apiQuery/hospital/types';
import dayjs from 'dayjs';

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
