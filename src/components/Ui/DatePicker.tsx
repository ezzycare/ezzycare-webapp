import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type Mode = 'single' | 'range' | 'multiple';

type Value = Date | null | [Date | null, Date | null] | Date[];

interface DatePickerProps {
  value?: Value;
  onChange?: (v: Value) => void;
  mode?: Mode;
  minDate?: Date;
  maxDate?: Date;
  disabledDate?: (date: Date) => boolean;
  locale?: string;
  weekStartsOn?: 0 | 1; // 0 = Sunday, 1 = Monday
  placeholder?: string;
  className?: string;
  closeOnSelect?: boolean;
}

// --- Helpers ---
const stripTime = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a?: Date | null, b?: Date | null) => {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};
const addMonths = (d: Date, n: number) => {
  const dd = new Date(d.getTime());
  const m = dd.getMonth() + n;
  dd.setMonth(m);
  return dd;
};
const addDays = (d: Date, n: number) => {
  const dd = new Date(d.getTime());
  dd.setDate(dd.getDate() + n);
  return dd;
};
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
const clamp = (d: Date, min?: Date, max?: Date) => {
  if (min && d < min) return stripTime(min);
  if (max && d > max) return stripTime(max);
  return stripTime(d);
};

const formatPretty = (v: Value, locale = 'default') => {
  if (!v) return '';
  if (Array.isArray(v)) {
    if (v.length === 0) return '';
    return v
      .map((d) => (d ? d.toLocaleDateString(locale) : ''))
      .filter(Boolean)
      .join(', ');
  }
  if ((v as [Date | null, Date | null])?.length === 2) {
    const [a, b] = v as [Date | null, Date | null];
    return `${a ? a.toLocaleDateString(locale) : ''}${a && b ? ' — ' : ''}${
      b ? b.toLocaleDateString(locale) : ''
    }`;
  }
  return (v as Date).toLocaleDateString(locale);
};

// --- Component ---
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value = null,
      onChange,
      mode = 'single',
      minDate,
      maxDate,
      disabledDate,
      locale = 'default',
      weekStartsOn = 0,
      placeholder = 'Select date',
      className = '',
      closeOnSelect = true,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState<Date>(() => {
      if (!value) return new Date();
      if (mode === 'single' && value instanceof Date) return value;
      if (mode === 'range' && Array.isArray(value) && value[0])
        return value[0] as Date;
      if (mode === 'multiple' && Array.isArray(value) && value.length)
        return value[0] as Date;
      return new Date();
    });

    const [focusDate, setFocusDate] = useState<Date>(stripTime(new Date()));
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const handle = (e: MouseEvent) => {
        if (!rootRef.current) return;
        if (!rootRef.current.contains(e.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', handle);
      return () => document.removeEventListener('mousedown', handle);
    }, []);

    useEffect(() => {
      if (value) {
        if (mode === 'single' && value instanceof Date) setViewDate(value);
        if (mode === 'range' && Array.isArray(value) && value[0])
          setViewDate(value[0] as Date);
        if (mode === 'multiple' && Array.isArray(value) && value[0])
          setViewDate(value[0] as Date);
      }
    }, [value, mode]);

    const isDisabled = useCallback(
      (d: Date) => {
        const t = stripTime(d);
        if (minDate && t < stripTime(minDate)) return true;
        if (maxDate && t > stripTime(maxDate)) return true;
        if (disabledDate && disabledDate(t)) return true;
        return false;
      },
      [minDate, maxDate, disabledDate]
    );

    const selectDate = useCallback(
      (d: Date) => {
        if (isDisabled(d)) return;
        if (mode === 'single') {
          onChange?.(stripTime(d));
          if (closeOnSelect) setOpen(false);
        } else if (mode === 'range') {
          const v = (value as [Date | null, Date | null]) || [null, null];
          let [start, end] = v;
          if (!start || (start && end)) {
            start = stripTime(d);
            end = null;
          } else {
            const picked = stripTime(d);
            if (picked < start) {
              end = start;
              start = picked;
            } else {
              end = picked;
            }
            if (closeOnSelect) setOpen(false);
          }
          onChange?.([start, end]);
        } else if (mode === 'multiple') {
          const arr = Array.isArray(value) ? [...value] : [];
          const exists = arr.find((x) => isSameDay(x as Date, d));
          if (exists) {
            const next = arr.filter((x) => !isSameDay(x as Date, d));
            onChange?.(next);
          } else {
            arr.push(stripTime(d));
            onChange?.(arr);
          }
          if (closeOnSelect) setOpen(false);
        }
      },
      [closeOnSelect, isDisabled, mode, onChange, value]
    );

    const withinRange = (d: Date) => {
      if (mode !== 'range') return false;
      const v = (value as [Date | null, Date | null]) || [null, null];
      const [a, b] = v;
      if (!a || !b) return false;
      const dd = stripTime(d).getTime();
      return dd >= stripTime(a).getTime() && dd <= stripTime(b).getTime();
    };

    const isSelected = (d: Date) => {
      if (!value) return false;
      if (mode === 'single') return isSameDay(value as Date, d);
      if (mode === 'range') {
        const [a, b] = (value as [Date | null, Date | null]) || [null, null];
        return isSameDay(a, d) || isSameDay(b, d) || withinRange(d);
      }
      if (mode === 'multiple')
        return (
          Array.isArray(value) && (value as Date[]).some((x) => isSameDay(x, d))
        );
      return false;
    };

    const weeks = useMemo(() => {
      const start = startOfMonth(viewDate);
      const end = endOfMonth(viewDate);
      // Find first day of calendar grid
      const startDay = start.getDay();
      const offset = (startDay - weekStartsOn + 7) % 7;
      const gridStart = addDays(start, -offset);
      const days: Date[] = [];
      for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
      const rows: Date[][] = [];
      for (let r = 0; r < 6; r++) rows.push(days.slice(r * 7, r * 7 + 7));
      return rows;
    }, [viewDate, weekStartsOn]);

    // keyboard handling
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') setFocusDate((d) => addDays(d, -1));
        if (e.key === 'ArrowRight') setFocusDate((d) => addDays(d, 1));
        if (e.key === 'ArrowUp') setFocusDate((d) => addDays(d, -7));
        if (e.key === 'ArrowDown') setFocusDate((d) => addDays(d, 7));
        if (e.key === 'Enter') selectDate(focusDate);
        if (e.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }, [open, focusDate, selectDate]);

    const headerLabel = useMemo(() => {
      return viewDate.toLocaleString(locale, {
        month: 'long',
        year: 'numeric',
      });
    }, [viewDate, locale]);

    return (
      <div className={`relative inline-block ${className}`} ref={rootRef}>
        <input
          ref={ref as any}
          readOnly
          onClick={() => setOpen((s) => !s)}
          className="w-64 px-3 py-2 border rounded-md bg-white text-sm cursor-pointer"
          placeholder={placeholder}
          value={formatPretty(value, locale)}
          aria-expanded={open}
          aria-haspopup="dialog"
        />

        {open && (
          <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg p-3 w-80">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                className="p-1 rounded hover:bg-slate-100"
                onClick={() => setViewDate((d) => addMonths(d, -1))}
                aria-label="Previous month"
              >
                ‹
              </button>
              <div className="text-sm font-medium">{headerLabel}</div>
              <button
                type="button"
                className="p-1 rounded hover:bg-slate-100"
                onClick={() => setViewDate((d) => addMonths(d, 1))}
                aria-label="Next month"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center text-slate-500 mb-1">
              {(() => {
                const labels = [] as string[];
                for (let i = 0; i < 7; i++) {
                  const day = addDays(new Date(1970, 0, 4 + weekStartsOn), i);
                  labels.push(
                    day.toLocaleDateString(locale, { weekday: 'short' })
                  );
                }
                return labels.map((n) => (
                  <div key={n} className="uppercase text-[10px] font-semibold">
                    {n}
                  </div>
                ));
              })()}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {weeks.map((week, wi) => (
                <React.Fragment key={wi}>
                  {week.map((d) => {
                    const outOfMonth = d.getMonth() !== viewDate.getMonth();
                    const disabled = isDisabled(d);
                    const selected = isSelected(d);
                    const focused = isSameDay(d, focusDate);
                    return (
                      <button
                        key={d.toISOString()}
                        type="button"
                        onClick={() => selectDate(d)}
                        onFocus={() => setFocusDate(d)}
                        className={`h-9 flex items-center justify-center rounded-md text-sm
                          ${outOfMonth ? 'text-slate-400' : 'text-slate-800'}
                          ${disabled ? 'opacity-40 pointer-events-none' : 'hover:bg-slate-100'}
                          ${selected ? 'bg-sky-600 text-white' : ''}
                          ${focused && !selected ? 'ring-2 ring-sky-300' : ''}`}
                        aria-pressed={selected}
                        aria-disabled={disabled}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="flex justify-end mt-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                }}
                className="px-3 py-1 text-sm rounded hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  // reset selection
                  onChange?.(
                    mode === 'range'
                      ? [null, null]
                      : mode === 'multiple'
                        ? []
                        : null
                  );
                }}
                className="px-3 py-1 text-sm rounded bg-slate-100 hover:bg-slate-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default DatePicker;
