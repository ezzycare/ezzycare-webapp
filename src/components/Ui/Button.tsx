import clsx from 'clsx';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonColor = string; // optional override (e.g. "bg-blue-10")

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  color?: ButtonColor; // overrides primary background only
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  color,
  className = '',
  disabled,
  loading = false,
  ...props
}: ButtonProps) => {
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
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
