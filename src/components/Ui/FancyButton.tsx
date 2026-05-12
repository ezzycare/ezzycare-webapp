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
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const FancyButton = ({
  children,
  icon = null,
  variant = 'outline',
  className = '',
  href,
  ...props
}: Props) => {
  const baseClasses = `
    relative z-0 flex items-center justify-center overflow-hidden rounded-lg border 
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
      <span>{children}</span>
      {icon && <span className="flex items-center ml-2">{icon}</span>}
    </button>
  );
};

export default FancyButton;
