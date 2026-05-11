'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

interface SelectOption {
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
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const Dropdown = ({
  label,
  placeholder = 'Select option',
  options,
  value,
  onChange,
  multiple = false,
  searchable = true,
  disabled = false,
  error,
  className = '',
}: DropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isMulti = multiple;

  const selectedValues = useMemo(() => {
    if (isMulti) {
      return Array.isArray(value) ? value : [];
    }

    return typeof value === 'string' ? [value] : [];
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
      if (value === optionValue) {
        onChange?.('');
      } else {
        onChange?.(optionValue);
      }
      setOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`w-full space-y-2 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs text-text uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Trigger */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={`
            w-full h-[48px]
            px-4 py-3
            rounded-xl
            border
            bg-foreground
            transition-all
            flex items-center justify-between gap-3
            text-left

            ${
              error
                ? 'border-red-500'
                : open
                  ? 'border-primary'
                  : 'border-neutral-3a'
            }

            ${
              disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:border-primary cursor-pointer'
            }
          `}
        >
          <div className="flex flex-wrap gap-2 flex-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="
                    px-2.5 py-1
                    rounded-full
                    bg-primary/10
                    border border-primary/20
                    text-xs text-primary
                    uppercase tracking-wide
                  "
                >
                  {option.label}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-8a uppercase tracking-wide">
                {placeholder}
              </span>
            )}
          </div>

          {/* Chevron */}
          <span
            className={`
              text-neutral-8a
              transition-transform duration-200
              ${open ? 'rotate-180' : ''}
            `}
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

        {/* Dropdown */}
        {open && (
          <div
            className="
              absolute z-50 mt-2
              w-full overflow-hidden
              rounded-2xl
              border border-neutral-3a
              bg-background
              shadow-2xl
            "
          >
            {/* Search */}
            {searchable && (
              <div className="p-3 border-b border-neutral-3a">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="
                    w-full
                    bg-transparent
                    border border-neutral-3a
                    rounded-xl
                    px-3 py-2
                    text-sm text-text
                    outline-none
                    focus:border-primary
                    transition
                  "
                />
              </div>
            )}

            {/* Options */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredOptions.length === 0 && (
                <div className="px-3 py-6 text-center text-xs text-neutral-8a uppercase tracking-wide">
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
                      w-full
                      flex items-start gap-3
                      rounded-xl
                      px-3 py-3
                      transition-all
                      text-left
                      relative

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
                    {/* Checkbox / Radio */}
                    <span
                      className={`
                        relative mt-0.5 shrink-0
                        w-4 h-4
                        rounded-full
                        border
                        transition-all

                        ${
                          active
                            ? 'border-primary bg-primary'
                            : 'border-neutral-3a'
                        }
                      `}
                    >
                      <span
                        className={`
                          absolute top-1/2 left-1/2
                          w-1.5 h-1.5
                          rounded-full
                          bg-background
                          -translate-x-1/2 -translate-y-1/2
                          transition-all

                          ${
                            active
                              ? 'scale-100 opacity-100'
                              : 'scale-0 opacity-0'
                          }
                        `}
                      />
                    </span>

                    {/* Text */}
                    <div className="flex flex-col gap-1">
                      <span
                        className={`
                          text-xs uppercase tracking-wide
                          ${active ? 'text-primary' : 'text-text'}
                        `}
                      >
                        {option.label}
                      </span>

                      {option.description && (
                        <span className="text-xs text-neutral-8a leading-relaxed">
                          {option.description}
                        </span>
                      )}

                      {active && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary" onClick={(e) => {
                          e.stopPropagation();
                          toggleValue(option.value);
                        }}>
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 uppercase tracking-wide">{error}</p>
      )}
    </div>
  );
};

export default Dropdown;
