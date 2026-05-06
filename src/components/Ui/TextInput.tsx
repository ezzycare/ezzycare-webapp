'use client';

import { countries } from '@/utils';
import React, { useState } from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const TextInput = ({
  label,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: TextInputProps) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-xs text-text uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-10">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            border border-neutral-3a
            bg-background
            text-text
            rounded-lg
            px-4 py-3
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            outline-none
            focus:border-primary
            transition
            placeholder:text-neutral-8a
            ${className}
          `}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-10">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const PhoneInput = ({ label = 'Phone Number', ...props }: PhoneInputProps) => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState(countries[0]);

  return (
    <div className="w-full space-y-2 relative">
      {label && (
        <label className="text-xs text-text uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div className="flex items-center border border-neutral-3a rounded-lg bg-background focus-within:border-primary transition">
        {/* COUNTRY SELECT */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-3 border-r border-neutral-3a cursor-pointer select-none bg-background
            text-text"
        >
          <span className={`fi fi-${country.code} fis w-5 h-4`} />
          <span className="text-sm text-text">{country.dial}</span>
        </div>

        {/* INPUT */}
        <input
          {...props}
          className="
            w-full px-4 py-3 bg-background
            text-text outline-none
            placeholder:text-neutral-8a
            rounded-r-lg
          "
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-background border border-neutral-3a rounded-lg shadow-lg overflow-hidden">
          {countries.map((c) => (
            <div
              key={c.code}
              onClick={() => {
                setCountry(c);
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-3a cursor-pointer"
            >
              <span className={`fi fi-${c.code} fis w-5 h-4`} />
              <span className="text-sm text-primary">{c.name}</span>
              <span className="ml-auto text-neutral-10">{c.dial}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PasswordInput = ({
  label = 'Password',
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <TextInput
      {...props}
      label={label}
      type={show ? 'text' : 'password'}
      className={className}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-xs text-neutral-11 hover:text-foreground"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      }
    />
  );
};

export { TextInput, PhoneInput, PasswordInput };
