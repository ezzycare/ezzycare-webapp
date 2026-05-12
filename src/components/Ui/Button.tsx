import clsx from 'clsx';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonColor = string; // optional override (e.g. "bg-blue-10")

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor; // overrides primary background only
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  color,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = clsx(
    'py-3 px-5 rounded-lg transition font-medium inline-flex',
    'items-center justify-center text-sm cursor-pointer active:scale-95'
  );

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white hover:opacity-70',
    secondary: 'bg-gray-3a text-gray-12 hover:bg-gray-8a',
    outline: 'border border-gray-8a text-gray-11 hover:bg-gray-11/5',
  };

  const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed';

  // Only override PRIMARY background if color is provided
  const colorOverride =
    variant === 'primary' && color ? `${color}! text-white` : '';

  return (
    <button
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${colorOverride}
        ${disabledStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
