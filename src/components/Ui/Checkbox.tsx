'use client';

import React, { useId, useState } from 'react';

interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'checked' | 'onChange'
> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  /** Controlled: pass checked state from outside */
  checked?: boolean;
  /** Controlled: handle state changes from outside */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  /** Uncontrolled: set the initial checked value */
  defaultChecked?: boolean;
}

const Checkbox = ({
  label,
  description,
  indeterminate = false,
  className = '',
  disabled,
  checked,
  onChange,
  defaultChecked = false,
  ...props
}: CheckboxProps) => {
  const id = useId();
  const checkboxRef = React.useRef<HTMLInputElement>(null);

  // Internal state — only used when `checked` is not passed in
  const [internalChecked, setInternalChecked] = useState(defaultChecked);

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  React.useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalChecked(e.target.checked);
    }
    onChange?.(e.target.checked, e);
  };

  return (
    <label
      htmlFor={id}
      className={`
        group flex items-start gap-3
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <input
        ref={checkboxRef}
        id={id}
        type="checkbox"
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
        className="sr-only peer"
        {...props}
      />

      <span
        className="
          relative mt-0.5 shrink-0
          w-4.5 h-4.5
          rounded-md
          border border-neutral-3a
          bg-background
          transition
          peer-focus-visible:border-primary
          peer-checked:bg-primary peer-checked:border-primary
          peer-indeterminate:bg-primary peer-indeterminate:border-primary
          group-hover:border-primary
        "
      >
        <svg
          className="
            absolute inset-0 m-auto
            w-2.5 h-2.5 text-white
            opacity-0 scale-75 transition-all
            [.peer:checked~span>&]:opacity-100
            [.peer:checked~span>&]:scale-100
          "
          viewBox="0 0 10 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 4l3 3 5-6" />
        </svg>

        {indeterminate && (
          <span className="absolute inset-0 m-auto w-2 h-0.5 rounded-full bg-surface-card" />
        )}
      </span>

      {(label || description) && (
        <span className="flex flex-col gap-0.5">
          {label && (
            <span className="text-xs text-text capitalize tracking-wide">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-neutral-8a leading-relaxed">
              {description}
            </span>
          )}
        </span>
      )}
    </label>
  );
};

export default Checkbox;
