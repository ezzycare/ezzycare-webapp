'use client';

import { useId } from 'react';

interface RadioOption {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

const RadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
  className = '',
}: RadioGroupProps) => {
  return (
    <fieldset className={`w-full space-y-2 ${className}`}>
      {label && (
        <legend className="text-xs text-text text-medium tracking-wide mb-3">
          {label}
        </legend>
      )}

      <div
        className={`
          flex gap-3
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => (
          <RadioItem
            key={option.value}
            name={name}
            option={option}
            checked={value === option.value}
            onChange={() => onChange?.(option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
};

interface RadioItemProps {
  name?: string;
  option: RadioOption;
  checked: boolean;
  onChange?: () => void;
  interactive?: boolean;
}

export const RadioItem = ({
  name,
  option,
  checked,
  onChange,
  interactive = true,
}: RadioItemProps) => {
  const id = useId();

  const isDisabled = option.disabled;

  return (
    <label
      htmlFor={interactive ? id : undefined}
      className={`
        group flex items-start gap-3
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${!interactive ? 'pointer-events-none' : ''}
      `}
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        disabled={isDisabled}
        onChange={interactive ? onChange : undefined}
        className="sr-only peer"
      />

      {/* Custom radio ring */}
      <span
        className={`
          relative mt-0.5 shrink-0
          w-4.5 h-4.5
          rounded-full
          bg-background
          border
          transition
          peer-focus-visible:border-primary
          group-hover:border-primary
          ${checked ? 'border-primary bg-primary' : 'border-neutral-3a'}
        `}
      >
        {/* Inner dot */}
        <span
          className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-2.5 h-2.5
            rounded-full
            bg-surface-card
            transition-all duration-200
            ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
          `}
        />
      </span>

      {/* Label + description */}
      {(option.label || option.description) && (
        <span className="flex flex-col gap-0.5">
          {option.label && (
            <span className="text-xs text-text tracking-wide">
              {option.label}
            </span>
          )}

          {option.description && (
            <span className="text-xs text-neutral-8a leading-relaxed">
              {option.description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default RadioGroup;
