'use client';

import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { useMemo, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | string[];
  chips?: boolean;
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  fullWidth?: boolean;
}

const Dropdown = ({
  label,
  placeholder = 'Select option',
  options,
  value,
  chips = false,
  onChange,
  multiple = false,
  searchable = true,
  disabled = false,
  error,
  icon,
  className = '',
  containerClassName = '',
  fullWidth = false,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isMulti = multiple;

  const selectedValues = useMemo(() => {
    if (isMulti) {
      return Array.isArray(value) ? value : [];
    }
    return typeof value === 'string' && value ? [value] : [];
  }, [value, isMulti]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query]);

  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value)
  );

  const toggleValue = (optionValue: string) => {
    if (isMulti) {
      const current = [...selectedValues];
      const exists = current.includes(optionValue);
      const updated = exists
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange?.(updated);
    } else {
      onChange?.(value === optionValue ? '' : optionValue);
      setOpen(false);
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-text capitalize tracking-wide">
          {label}
        </label>
      )}

      <Popover
        isOpen={open}
        onOpenChange={(isOpen) => !disabled && setOpen(isOpen)}
        // placement="bottom-start"
      >
        <PopoverTrigger
          className={`${fullWidth ? 'w-full min-w-full' : ''} ${disabled ? 'pointer-events-none' : ''}`}
        >
          <button
            type="button"
            disabled={disabled}
            className={`
              w-full h-9 px-4 py-3 rounded-xl border bg-surface-card
              transition-all flex items-center justify-between gap-3 text-left
              ${
                error
                  ? 'border-red-500'
                  : open
                    ? 'border-primary'
                    : 'border-neutral-3a'
              }
              ${
                disabled
                  ? 'bg-gray-3! text-neutral-10! border border-neutral-6a! pointer-events-none cursor-not-allowed'
                  : 'hover:border-primary cursor-pointer'
              }
              ${containerClassName}
            `}
          >
            <div className="flex flex-wrap gap-2 flex-1">
              {icon && icon}
              {chips && selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className={cn(`
                      px-2.5 py-1 rounded-full bg-primary/10
                      border border-primary/20 text-xs text-primary
                      capitalize tracking-wide
                    `)}
                  >
                    {option.label}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-alt capitalize tracking-wide">
                  {selectedOptions.length > 0
                    ? selectedOptions.map((option) => option.label).join(', ')
                    : placeholder}
                </span>
              )}
            </div>

            <span
              className={`text-neutral-8a transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            'rounded-2xl border border-gray-3 w-[320px] bg-surface-card shadow-2xl p-0'
          )}
        >
          <div className="w-full">
            {searchable && (
              <div className="p-3 border-b border-neutral-3a">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className={cn(`
                    w-full bg-transparent border border-neutral-3a rounded-xl
                    px-3 py-2 text-sm text-text outline-none
                    focus:border-primary transition
                  `)}
                />
              </div>
            )}

            <div className="max-h-72 overflow-y-auto p-2">
              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-neutral-8a capitalize tracking-wide">
                  No options found
                </div>
              )}

              {filteredOptions.map((option) => {
                const active = selectedValues.includes(option.value);

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => toggleValue(option.value)}
                    className={`
                      w-full flex items-start gap-3 rounded-xl px-3 py-3
                      transition-all text-left relative
                      ${
                        active
                          ? 'bg-primary/10 border border-primary/20'
                          : 'border border-transparent hover:border-primary/20 hover:bg-primary/5'
                      }
                      ${
                        option.disabled
                          ? 'opacity-40 cursor-not-allowed'
                          : 'cursor-pointer'
                      }
                    `}
                  >
                    <span
                      className={`
                        relative mt-0.5 shrink-0 w-4 h-4 rounded-full border transition-all
                        ${active ? 'border-primary bg-primary' : 'border-neutral-3a'}
                      `}
                    >
                      <span
                        className={`
                          absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full
                          bg-background -translate-x-1/2 -translate-y-1/2 transition-all
                          ${active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                        `}
                      />
                    </span>

                    <div className="flex flex-col gap-1">
                      <span
                        className={`text-xs capitalize tracking-wide ${active ? 'text-primary' : 'text-text'}`}
                      >
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs text-neutral-8a leading-relaxed">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-xs text-red-500 capitalize tracking-wide">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
