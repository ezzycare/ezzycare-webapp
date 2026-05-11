'use client';

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

const FancyButton = ({
  children,
  icon = null,
  variant = 'outline',
  className = '',
  href,
  ...props
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  href?: string;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  [key: string]: unknown;
}) => {
  return (
    <button
      className={`
        relative z-0 flex items-center overflow-hidden rounded-lg border 
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
      `}
      {...props}
      {...(href ? { onClick: () => (window.location.href = href) } : {})}
      {...(href ? { href } : {})}
    >
      <span>{children}</span>
      {icon && <span className="flex items-center ml-2">{icon}</span>}
    </button>
  );
};

export default FancyButton;
