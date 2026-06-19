// components/availability/AddSessionModal.tsx
'use client';

import Button from '@/components/Ui/Button';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { toaster } from '@/lib/toaster';
import { Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ConsultationType, DayKey, Session } from './SetAvailabilityModal';

interface AddSessionModalProps {
  open: boolean;
  day: DayKey;
  isLoading: boolean;
  onClose: () => void;
  onSave: (session: Omit<Session, 'id'>) => void;
}

type Period = 'AM' | 'PM';

const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);
const MINUTES = ['00', '15', '30', '45'];
const PERIODS: Period[] = ['AM', 'PM'];

export default function AddSessionModal({
  open,
  isLoading,
  onClose,
  onSave,
}: AddSessionModalProps) {
  const [consultationType, setConsultationType] =
    useState<ConsultationType>('video');
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [startPeriod, setStartPeriod] = useState<Period>('AM');
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('00');
  const [endPeriod, setEndPeriod] = useState<Period>('AM');

  const startTime = `${startHour}:${startMinute} ${startPeriod}`;
  const endTime = `${endHour}:${endMinute} ${endPeriod}`;

  const selectedLabel = useMemo(
    () => `${startTime} - ${endTime}`,
    [startTime, endTime]
  );

  // const handleSave = () => {
  //   onSave({
  //     consultationType,
  //     startTime,
  //     endTime,
  //   });
  // };

  const handleSave = () => {
    // Convert to comparable minutes since midnight
    const startMins = toMinutes(startHour, startMinute, startPeriod);
    const endMins = toMinutes(endHour, endMinute, endPeriod);
    if (endMins <= startMins) {
      toaster.error('End time must be after start time');
      return;
    }
    onSave({ consultationType, startTime, endTime });
  };

  function toMinutes(h: string, m: string, p: Period) {
    let hour = parseInt(h, 10);
    if (p === 'PM' && hour !== 12) hour += 12;
    if (p === 'AM' && hour === 12) hour = 0;
    return hour * 60 + parseInt(m, 10);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton
      title=""
      className="translate-y-20 rounded-[30px]!"
    >
      <div className="flex flex-col gap-5">
        {/* Consultation type radios */}
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-text-muted">
            Consultation type
          </span>
          <div className="flex items-center gap-6">
            {(['video', 'home', 'clinic'] as ConsultationType[]).map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 cursor-pointer"
              >
                <RadioItem
                  name="consultationType"
                  checked={consultationType === type}
                  option={{ value: '', label: '' }}
                  onChange={() => setConsultationType(type)}
                />
                <span className="text-sm text-text capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Start time */}
        <TimeRow
          label="Start time"
          hour={startHour}
          minute={startMinute}
          period={startPeriod}
          onHourChange={setStartHour}
          onMinuteChange={setStartMinute}
          onPeriodChange={setStartPeriod}
        />

        {/* End time */}
        <TimeRow
          label="End time"
          hour={endHour}
          minute={endMinute}
          period={endPeriod}
          onHourChange={setEndHour}
          onMinuteChange={setEndMinute}
          onPeriodChange={setEndPeriod}
        />

        {/* Selected time summary */}
        <div className="border border-border2 rounded-xl px-4 py-3 flex items-center justify-center gap-3">
          <span className="text-sm text-text-muted">Selected time:</span>
          <span className="text-sm font-medium text-text">{selectedLabel}</span>
        </div>

        <Button
          variant="primary"
          className="w-full h-12 mt-4 rounded-full"
          loading={isLoading}
          onClick={handleSave}
        >
          Save session
        </Button>
      </div>
    </Modal>
  );
}

interface TimeRowProps {
  label: string;
  hour: string;
  minute: string;
  period: Period;
  onHourChange: (v: string) => void;
  onMinuteChange: (v: string) => void;
  onPeriodChange: (v: Period) => void;
}

function TimeRow({
  label,
  hour,
  minute,
  period,
  onHourChange,
  onMinuteChange,
  onPeriodChange,
}: TimeRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-text-muted" />
        <span className="text-sm text-text-muted">{label}</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
        <TimeSelect value={hour} onChange={onHourChange} options={HOURS} />
        <span className="text-text-muted">:</span>
        <TimeSelect
          value={minute}
          onChange={onMinuteChange}
          options={MINUTES}
        />
        <span className="text-text-muted">:</span>
        <TimeSelect
          value={period}
          onChange={(v) => onPeriodChange(v as Period)}
          options={PERIODS}
        />
      </div>
    </div>
  );
}

interface TimeSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}

function TimeSelect({ value, onChange, options }: TimeSelectProps) {
  return (
    <div className="relative">
      <Dropdown
        value={value}
        onChange={(e) => onChange(String(e))}
        options={options?.map((o) => ({ value: o, label: o }))}
        containerClassName="bg-gray-2! h-10 border-none!"
        className="text-text w-full rounded-xl text-sm"
      />
    </div>
  );
}
