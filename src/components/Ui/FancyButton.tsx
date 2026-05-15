'use client';

import Link from 'next/link';
import React from 'react';

type ButtonVariant = 'outline' | 'primary';

const variantStyles: Record<ButtonVariant, string> = {
  outline: `
    border-gray-200
    text-[#005365]
    bg-white
    hover:text-white
    hover:before:bg-primary
  `,
  primary: `
    border-primary
    bg-primary
    text-white
    hover:text-[#005365]
    hover:before:bg-white
  `,
};

type Props = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  href?: string;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const FancyButton = ({
  children,
  icon = null,
  variant = 'outline',
  className = '',
  href,
  loading = false,
  ...props
}: Props) => {
  const baseClasses = `
    group relative z-0 flex items-center justify-center overflow-hidden rounded-lg border 
    px-4 py-2 text-sm font-medium cursor-pointer
    transition-all duration-500

    before:absolute before:inset-0
    before:-z-10 before:translate-x-[150%]
    before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%]
    before:transition-transform before:duration-1000
    before:content-['']

    hover:scale-100
    hover:before:translate-x-[0%]
    hover:before:translate-y-[0%]
    active:scale-95

    ${variantStyles[variant]}

    disabled:opacity-50 disabled:cursor-not-allowed
    ${className}
  `;

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        <span>{children}</span>
        {icon && <span className="flex items-center ml-2">{icon}</span>}
      </Link>
    );
  }

  return (
    <button {...props} className={baseClasses}>
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5"
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
        <>
          <span>{children}</span>
          {icon && <span className="flex items-center ml-2">{icon}</span>}
        </>
      )}
    </button>
  );
};

export default FancyButton;
