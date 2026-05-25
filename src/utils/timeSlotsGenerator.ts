export type TimeSlot = {
  label: string;
  value: string;
  blocked?: boolean;
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatValue = (date: Date) => {
  return date.toTimeString().slice(0, 5); // "HH:MM"
};

export function* timeSlotGenerator(
  startHour = 8,
  endHour = 17,
  intervalMinutes = 20
): Generator<TimeSlot> {
  const current = new Date();
  current.setHours(startHour, 0, 0, 0);

  const end = new Date();
  end.setHours(endHour, 0, 0, 0);

  while (current < end) {
    const start = new Date(current);
    const next = new Date(current);
    next.setMinutes(next.getMinutes() + intervalMinutes);

    yield {
      label: `${formatTime(start)} – ${formatTime(next)}`,
      value: formatValue(start),
    };

    current.setMinutes(current.getMinutes() + intervalMinutes);
  }
}
