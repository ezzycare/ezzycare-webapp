'use client';

import { cn } from '@/lib/utils';
import { ChevronDown, Clock3, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface OperatingHour {
  id: string;
  day: Day;
  startTime: string;
  endTime: string;
}

const DAYS: Day[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_OPTIONS = [
  '12:00 AM',
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
];

interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSelect = ({ value, onChange }: TimeSelectProps) => {
  return (
    <div className="relative">
      <Clock3
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-11a"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(`
          h-8
          min-w-30
          appearance-none
          rounded-lg
          bg-neutral-3a
          px-4
          pr-9
          text-sm
          font-medium
          text-neutral-12
          outline-none
          transition
          hover:border-neutral-3
          focus:border-neutral-3`)}
      >
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
};

interface DaySelectProps {
  value: Day;
  onChange: (value: Day) => void;
}

const DaySelect = ({ value, onChange }: DaySelectProps) => {
  return (
    <div className="relative">
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
      />

      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Day)}
        className={cn(`
          h-8
          min-w-37
          appearance-none
          rounded-lg
          border
          border-neutral-8a
          bg-surface-card
          px-4
          pr-10
          text-sm
          font-medium
          text-neutral-12
          outline-none
          transition
          hover:border-neutral-3
          focus:border-neutral-3`)}
      >
        {DAYS.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
};

interface OperatingHoursProps {
  value?: OperatingHour[];
  onChange?: (value: OperatingHour[]) => void;
}

export default function OperatingHours({
  value,
  onChange,
}: OperatingHoursProps) {
  const [hours, setHours] = useState<OperatingHour[]>(
    value ?? [
      {
        id: crypto.randomUUID(),
        day: 'Monday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
      {
        id: crypto.randomUUID(),
        day: 'Tuesday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
      {
        id: crypto.randomUUID(),
        day: 'Wednesday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
      {
        id: crypto.randomUUID(),
        day: 'Thursday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
      {
        id: crypto.randomUUID(),
        day: 'Friday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
    ]
  );

  useEffect(() => {
    onChange?.(hours);
  }, []);

  const updateHours = (updated: OperatingHour[]) => {
    setHours(updated);
    onChange?.(updated);
  };

  const updateItem = (
    id: string,
    field: keyof OperatingHour,
    value: string
  ) => {
    const updated = hours.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
          }
        : item
    );

    updateHours(updated);
  };

  const removeItem = (id: string) => {
    updateHours(hours.filter((item) => item.id !== id));
  };

  const addRow = () => {
    updateHours([
      ...hours,
      {
        id: crypto.randomUUID(),
        day: 'Monday',
        startTime: '9:00 AM',
        endTime: '5:00 PM',
      },
    ]);
  };

  return (
    <div className="w-full max-w-135 rounded-2xl bg-surface-card">
      <div className="space-y-1.5">
        {hours.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            {/* Day */}
            <DaySelect
              value={item.day}
              onChange={(value) => updateItem(item.id, 'day', value)}
            />

            {/* Start */}
            <TimeSelect
              value={item.startTime}
              onChange={(value) => updateItem(item.id, 'startTime', value)}
            />

            {/* To */}
            <span className="text-sm text-neutral-500">to</span>

            {/* End */}
            <TimeSelect
              value={item.endTime}
              onChange={(value) => updateItem(item.id, 'endTime', value)}
            />

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                text-neutral-500
                transition
                hover:bg-neutral-100
                hover:text-red-500
              "
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addRow}
        className="
          mt-5
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-neutral-300
          bg-surface-card
          px-4
          py-2.5
          text-sm
          font-medium
          text-neutral-700
          transition
          hover:bg-neutral-50
          hover:border-neutral-400
        "
      >
        <Upload size={16} />
        Add Operating hours
      </button>
    </div>
  );
}
