/* eslint-disable react-hooks/set-state-in-effect */
import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import { TimeSlot } from '@/utils/timeSlotsGenerator';
import dayjs from 'dayjs';
import { Clock } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2026 + i);

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

/**
 * DateTimePicker
 *
 * Props:
 * - blockedDates: Date[]         — dates that are fully disabled
 * - timeSlots: { label: string, value: string, blocked?: boolean }[]
 *                                 — available time slots (filtered per selected date)
 * - blockedTimesByDate: Record<string, string[]>
 *                                 — map of "YYYY-MM-DD" → blocked slot values for that day
 * - defaultDate: Date             — pre-selected date
 * - defaultTimeSlot: string       — pre-selected time slot value
 * - onSelect: ({ date, timeSlot }) => void — emits { date: Date, timeSlot: string }
 * - applyLabel: string            — label for the action button (default "Apply")
 * - showStartEnd: boolean         — show start/end time display (image 2 style) vs slot list (image 1)
 */
export default function DateTimePicker({
  interval,
  blockedDates = [],
  timeSlots = [
    { label: '11:00 AM – 11:20 AM', value: '11:00' },
    { label: '11:30 AM – 11:50 AM', value: '11:30' },
    { label: '1:00 PM – 1:20 PM', value: '13:00' },
  ],
  blockedTimesByDate = {},
  defaultDate = null,
  defaultTimeSlot = null,
  onSelect,
  applyLabel = 'Apply',
  applyImmediately,
  onDaySelect,
}: {
  interval: number;
  blockedDates?: Date[];
  timeSlots?: TimeSlot[];
  blockedTimesByDate?: Record<string, string[]>;
  defaultDate?: Date | null;
  defaultTimeSlot?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect?: any;
  applyLabel?: string;
  applyImmediately?: boolean;
  onDaySelect?: (date: Date) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    defaultDate ? defaultDate.getFullYear() : today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    defaultDate ? defaultDate.getMonth() : today.getMonth()
  );
  const [selectedDate, setSelectedDate] = useState(defaultDate || null);
  const [selectedSlot, setSelectedSlot] = useState(defaultTimeSlot || null);
  const [showSelected, setShowSelected] = useState<boolean>(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const dateKey = (d: Date) =>
    d
      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      : null;

  const isBlocked = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return blockedDates.some((bd) => isSameDay(bd, d));
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return isSameDay(selectedDate, new Date(viewYear, viewMonth, day));
  };

  const isToday = (day: number) =>
    isSameDay(new Date(viewYear, viewMonth, day), today);

  useEffect(() => {
    if (!selectedDate) return;

    const daysInNewMonth = getDaysInMonth(viewYear, viewMonth);
    const safeDay = Math.min(selectedDate.getDate(), daysInNewMonth);

    setSelectedDate(new Date(viewYear, viewMonth, safeDay));
    setSelectedSlot(null);
  }, [viewMonth, viewYear]);

  const isPastDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);

    return dayjs(date).startOf('day').isBefore(dayjs().startOf('day'));
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day: number) => {
    if (isBlocked(day)) return;
    const d = new Date(viewYear, viewMonth, day);
    setSelectedDate(d);
    setSelectedSlot(null);
    onDaySelect?.(d);
  };

  const availableSlots = useCallback(() => {
    if (!selectedDate) return timeSlots;
    const key = dateKey(selectedDate);
    const blockedForDay = blockedTimesByDate[key || ''] || [];
    return timeSlots.map((s) => ({
      ...s,
      blocked: s.blocked || blockedForDay.includes(s.value),
    }));
  }, [selectedDate, timeSlots, blockedTimesByDate]);

  const handleSlotClick = (slot: {
    label: string;
    value: string;
    blocked?: boolean;
  }) => {
    if (slot.blocked) return;
    setSelectedSlot(slot.value);

    if (applyImmediately) {
      onSelect?.({ date: selectedDate, timeSlot: slot.value });
    }
  };

  const handleApply = () => {
    if (!selectedDate || !selectedSlot) return;
    setShowSelected(true);
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedSlot) return;
    onSelect?.({ date: selectedDate, timeSlot: selectedSlot });
  };

  const slots = availableSlots();
  const canApply = selectedDate && selectedSlot;

  // Build calendar grid (6 rows x 7 cols)
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="flex flex-col">
      <div className="bg-surface-card rounded-2xl py-6 px-5 w-full shadow-md">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <NavButton onClick={handlePrevMonth} direction="left" />
          {/* <button
            onClick={() => {}}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--blue-10)',
              fontWeight: 600,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: 0,
            }}
          >
            {MONTHS[viewMonth]} {viewYear}
            <ChevronRightIcon size={14} />
          </button> */}
          <div className="flex gap-2 items-center">
            <select
              id="month"
              value={viewMonth}
              className="py-1.5 px-2 border border-border2 rounded-lg text-sm text-text-alt"
              onChange={(e) => setViewMonth(Number(e.target.value))}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <select
              id="year"
              value={viewYear}
              className="py-1.5 px-2 border border-border2 rounded-lg text-sm text-text-alt"
              onChange={(e) => setViewYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <NavButton onClick={handleNextMonth} direction="right" />
        </div>

        {/* Day labels */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            marginBottom: 4,
          }}
        >
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--gray-10)',
                letterSpacing: '0.04em',
                paddingBottom: 6,
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '2px 0',
          }}
        >
          {cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const blocked = isBlocked(day);
            const selected = isSelected(day);
            const todayDay = isToday(day);
            const pastDay = isPastDay(day);

            return (
              <button
                key={`day-${day}`}
                onClick={() => {
                  handleDayClick(day);
                  setShowSelected(false);
                }}
                disabled={blocked || pastDay}
                className="rounded-lg"
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  border: 'none',
                  background: selected
                    ? 'var(--blue-10)'
                    : todayDay && !selected
                      ? 'var(--blue-3a)'
                      : blocked
                        ? 'var(--gray-3)'
                        : 'transparent',
                  color: selected
                    ? '#fff'
                    : blocked || pastDay
                      ? 'var(--gray-11)'
                      : 'var(--text-text)',
                  fontWeight: selected ? 600 : 400,
                  fontSize: 15,
                  cursor: blocked || pastDay ? 'not-allowed' : 'pointer',
                  opacity: pastDay ? 0.6 : 1,
                  transition: 'background 0.15s, transform 0.1s',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!blocked && !selected)
                    e.currentTarget.style.background = 'var(--blue-2a)';
                }}
                onMouseLeave={(e) => {
                  if (!blocked && !selected)
                    e.currentTarget.style.background = 'transparent';
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-4" />

      {showSelected && selectedSlot && selectedDate ? (
        <SelectedSlotDisplay
          interval={interval}
          slots={slots}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
        />
      ) : (
        <div
          className="max-h-20 overflow-y-auto grid grid-cols-2 gap-2"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--primary), transparent',
          }}
        >
          {slots.map((slot) => {
            const isSelectedSlot = selectedSlot === slot.value;
            return (
              <button
                key={slot.value}
                onClick={() => handleSlotClick(slot)}
                disabled={slot.blocked}
                className="text-[13px] py-1.5 px-5 font-medium border border-border2 hover:border-primary rounded-lg"
                style={{
                  width: '100%',
                  background: isSelectedSlot
                    ? 'var(--blue-2a)'
                    : 'var(--gray-1)',
                  color: slot.blocked
                    ? 'var(--gray-8a)'
                    : isSelectedSlot
                      ? 'var(--blue-11)'
                      : 'var(--gray-12)',
                  cursor: slot.blocked ? 'not-allowed' : 'pointer',
                  textAlign: 'center',
                  textDecoration: slot.blocked ? 'line-through' : 'none',
                  transition: 'border 0.15s, background 0.15s, color 0.15s',
                  outline: 'none',
                  fontFamily: 'var(--font-display)',
                }}
                onMouseEnter={(e) => {
                  if (!slot.blocked && !isSelectedSlot)
                    e.currentTarget.style.background = 'var(--blue-2a)';
                }}
                onMouseLeave={(e) => {
                  if (!slot.blocked && !isSelectedSlot)
                    e.currentTarget.style.background = 'var(--gray-1)';
                }}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}

      {!applyImmediately && (
        <div className="mt-5">
          {!showSelected && (
            <Button
              variant="primary"
              className="w-full text-lg py-3.5"
              onClick={handleApply}
            >
              {applyLabel}
            </Button>
          )}
          {showSelected && (
            <Button
              variant="primary"
              className="w-full text-lg py-3.5"
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function NavButton({
  onClick,
  direction,
}: {
  onClick: () => void;
  direction: 'left' | 'right';
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 32,
        height: 32,
        borderRadius: 8,
        border: '1.5px solid var(--gray-4)',
        background: 'var(--gray-1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--blue-10)',
      }}
    >
      {direction === 'left' ? (
        <ChevronLeftIcon size={16} />
      ) : (
        <ChevronRightIcon size={16} />
      )}
    </button>
  );
}

/* ─── Icon helpers ────────────────────────────────────────────── */

function ChevronLeftIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="10 12 6 8 10 4" />
    </svg>
  );
}

function ChevronRightIcon({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 12 10 8 6 4" />
    </svg>
  );
}

export const SelectedSlotDisplay = ({
  interval,
  slots,
  selectedDate,
  selectedSlot,
  className = '',
}: {
  interval: number;
  slots: TimeSlot[];
  selectedDate: Date;
  selectedSlot: string;
  className?: string;
}) => {
  const slot = slots.find((s) => s.value === selectedSlot);
  const timeMeridian = slot?.label?.split(' ')[1]?.slice(0, 1);
  const splitSlot = selectedSlot?.split(':');
  return (
    <div
      className={cn(`
        flex flex-col items-center gap-2 text-text-alt 
        text-xs w-full px-4 sm:px-9 py-4.5 bg-surface-card rounded-xl
        ${className}
      `)}
    >
      <div className="flex w-full items-center gap-2 justify-between">
        <p className="flex items-center gap-2 opacity-70">
          <Clock size={16} /> <span>Start time</span>
        </p>
        <p className="flex items-center gap-3">
          <span>{dayjs(selectedDate).format('DD/MM/YYYY')}</span>
          <span>
            {dayjs()
              .hour(Number(splitSlot[0]))
              .minute(Number(splitSlot[1]))
              .format(`HH:mm ${timeMeridian}`)}
          </span>
        </p>
      </div>
      <div className="flex w-full items-center gap-2 justify-between">
        <p className="flex items-center gap-2 opacity-70">
          <Clock size={16} /> <span>End time</span>
        </p>
        <p className="flex items-center gap-3">
          <span>{dayjs(selectedDate).format('DD/MM/YYYY')}</span>
          <span>
            {dayjs()
              .hour(Number(splitSlot[0]))
              .minute(Number(splitSlot[1]))
              .add(interval, 'minute')
              .format(`HH:mm ${timeMeridian}`)}
          </span>
        </p>
      </div>
    </div>
  );
};
