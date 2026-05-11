import React from 'react';

const MenuIcon = ({
  size = 24,
  color = 'currentColor',
  ...props
}: React.SVGProps<SVGSVGElement> & { size?: number; color?: string }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 6h18M3 12h18M3 18h18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default MenuIcon;
