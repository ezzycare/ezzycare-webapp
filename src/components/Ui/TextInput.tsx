'use client';

import { countries } from '@/utils';
import React, { useState } from 'react';
import clsx from 'clsx';
import {
  EyeClosedIcon,
  EyeOpenIcon,
  LockClosedIcon,
} from '@radix-ui/react-icons';

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
        <label className="text-sm font-medium text-text tracking-wide">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-11a">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          value={props.type === 'password' ? '************' : props.value}
          className={`${clsx(
            'w-full border border-neutral-3a h-14 bg-foreground',
            'text-text text-sm rounded-xl px-4 py-4 outline-none',
            'focus:border-primary transition placeholder:text-neutral-8a'
          )}
            ${leftIcon ? 'pl-8' : ''}
            ${rightIcon ? 'pr-8' : ''}
            ${className}
          `}
        />

        {rightIcon && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-11a">
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
        <label className="text-sm font-medium text-text tracking-wide">
          {label}
        </label>
      )}

      {/* INPUT WRAPPER */}
      <div
        className={clsx(
          'flex items-center border border-neutral-3a rounded-lg',
          'bg-foreground focus-within:border-primary transition'
        )}
      >
        {/* COUNTRY SELECT */}
        <div
          onClick={() => setOpen(!open)}
          className={clsx(
            'flex items-center gap-2 px-3 py-3 border-r border-neutral-3a cursor-pointer select-none',
            'bg-foreground text-text rounded-xl'
          )}
        >
          <span className={`fi fi-${country.code} fis w-5 h-4`} />
          <span className="text-sm text-neutral-11a">{country.dial}</span>
        </div>

        {/* INPUT */}
        <input
          {...props}
          className={clsx(
            'w-full border-r border-neutral-3a h-13.5 bg-foreground',
            'text-text text-sm rounded-xl px-4 py-4 outline-none',
            'placeholder:text-neutral-8a rounded-r-lg'
          )}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className={clsx(
            'absolute z-50 mt-1 w-full bg-foreground border',
            'border-neutral-3a rounded-lg shadow-lg overflow-hidden'
          )}
        >
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
              <span className="text-sm text-text">{c.name}</span>
              <span className="ml-auto text-xs text-neutral-11a">{c.dial}</span>
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
      leftIcon={<LockClosedIcon className="text-neutral-11a" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-xs cursor-pointer text-neutral-11a"
        >
          {show ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      }
    />
  );
};

export { TextInput, PhoneInput, PasswordInput };
