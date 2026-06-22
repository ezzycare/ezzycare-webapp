'use client';

import { CalendarIconLocal } from '@/icons/DashboardNavIcons';
import { cn } from '@/lib/utils';
import {
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@heroui/react';
import {
    CalendarDate,
    getLocalTimeZone,
    today,
    type DateValue,
} from '@internationalized/date';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as React from 'react';

type DatePickerProps = {
  value?: DateValue | null;
  defaultValue?: DateValue | string;
  onChange?: (date: string) => void;
  label?: string;
  placeholder?: string;
  minValue?: DateValue;
  maxValue?: DateValue;
  isDisabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  buttonClassName?: string;
  startContent?: React.ReactNode;
  iconPlacement?: 'left' | 'right';
};

const formatDate = (date: DateValue | null | undefined) => {
  if (!date) return 'Select date';

  return date.toDate(getLocalTimeZone()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * "YYYY-MM-DD" -> DateValue
 */
export function parseYMDToDateValue(input?: string): DateValue | undefined {
  if (!input) return undefined;

  const [yyyy, mm, dd] = input.split('-').map(Number);

  if (!dd || !mm || !yyyy) return undefined;

  return new CalendarDate(yyyy, mm, dd);
}

/**
 * DateValue -> "YYYY-MM-DD"
 */
export function formatDateValueToYMDShort(date: DateValue): string {
  const jsDate = date.toDate(getLocalTimeZone());

  const dd = String(jsDate.getDate()).padStart(2, '0');
  const mm = String(jsDate.getMonth() + 1).padStart(2, '0');
  const yy = String(jsDate.getFullYear()).slice(-2);

  return `${yy}-${mm}-${dd}`;
}

export function DatePicker({
  value,
  defaultValue = today(getLocalTimeZone()),
  onChange,
  label = 'Select Date',
  placeholder = 'Select date',
  minValue,
  maxValue,
  isDisabled,
  fullWidth,
  className,
  buttonClassName,
  startContent,
  iconPlacement = 'left',
}: DatePickerProps) {
  const normalizedDefault = React.useMemo(() => {
    if (typeof defaultValue === 'string') {
      return parseYMDToDateValue(defaultValue) ?? today(getLocalTimeZone());
    }
    return defaultValue ?? today(getLocalTimeZone());
  }, [defaultValue]);

  const [internal, setInternal] = React.useState<DateValue>(normalizedDefault);

  const isControlled = value !== undefined;
  const selectedDate = isControlled ? (value ?? undefined) : internal;

  const handleChange = (date: DateValue) => {
    if (!isControlled) setInternal(date);

    onChange?.(formatDateValueToYMDShort(date));
  };

  return (
    <div
      className={cn(
        `inline-flex relative ${fullWidth ? 'w-full' : ''} ${className}`
      )}
    >
      <Popover>
        <PopoverTrigger className={fullWidth ? 'w-full' : ''}>
          <button
            className={cn(
              `bg-gray-2 px-3 py-3 rounded-xl flex items-center gap-2 
              cursor-pointer border border-transparent hover:border-gray-300 transition
              ${fullWidth ? 'w-full justify-between' : ''}
              ${buttonClassName}
              `
            )}
            disabled={isDisabled}
          >
            {iconPlacement === 'left' && <CalendarIconLocal />}

            <div className="flex items-center gap-2">
              {startContent}

              <span className="text-sm font-medium text-muted">
                {selectedDate ? formatDate(selectedDate) : placeholder}
              </span>

              {iconPlacement === 'left' && (
                <ChevronDownIcon className="h-4 w-4 transition-transform text-muted" />
              )}
            </div>
            {iconPlacement === 'right' && <CalendarIconLocal />}
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] rounded-2xl border border-gray-3 bg-surface-card p-4 shadow-2xl">
          <div className="mb-4 text-sm font-medium text-default-500">
            {label}
          </div>

          <Calendar
            aria-label={label}
            value={selectedDate ?? undefined}
            onChange={handleChange}
            minValue={minValue}
            maxValue={maxValue}
            className="w-full"
          >
            <Calendar.Header className="mb-4 flex items-center justify-between">
              <Calendar.NavButton
                slot="previous"
                className={cn(
                  `flex h-9 w-9 text-primary items-center justify-center 
                  rounded-lg border border-default-200 hover:bg-default-100`
                )}
              >
                ←
              </Calendar.NavButton>

              <Calendar.Heading className="ml-3 text-sm font-semibold text-text-muted" />

              <Calendar.NavButton
                slot="next"
                className={cn(
                  `flex h-9 w-9 text-primary items-center justify-center 
                  rounded-lg border border-default-200 hover:bg-default-100`
                )}
              >
                →
              </Calendar.NavButton>
            </Calendar.Header>

            <Calendar.Grid className="w-full border-collapse">
              <Calendar.GridHeader>
                {(day) => (
                  <Calendar.HeaderCell
                    className={cn(
                      `pb-3 text-center text-xs font-semibold 
                      uppercase tracking-wide text-default-400`
                    )}
                  >
                    {day}
                  </Calendar.HeaderCell>
                )}
              </Calendar.GridHeader>

              <Calendar.GridBody>
                {(date) => (
                  <Calendar.Cell
                    date={date}
                    className={cn(
                      `h-10 w-10 rounded-xl flex items-center justify-center text-sm text-text-muted 
                      hover:bg-default-100 data-selected:bg-primary data-selected:text-white 
                      data-disabled:opacity-30 transition`
                    )}
                  />
                )}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
