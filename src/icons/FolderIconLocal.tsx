import * as React from 'react';

export const FolderIconLocal = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={43}
    height={28}
    fill="none"
    {...props}
  >
    <path
      fill="#00C8FF"
      fillOpacity={0.145}
      d="M0 8a8 8 0 0 1 8-8h27a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V8Z"
    />
    <path
      fill="#007E9B"
      d="M29.5 13.303v4.185c0 2.212-1.8 4.012-4.012 4.012h-6.976a4.017 4.017 0 0 1-4.012-4.012V12.08h14.805c.113.338.172.683.188 1.05.007.053.007.12.007.173Z"
    />
    <path
      fill="#007E9B"
      d="M29.305 12.08H14.5V9.815A3.316 3.316 0 0 1 17.815 6.5h1.747c1.223 0 1.605.397 2.093 1.05l1.05 1.395c.233.307.263.352.698.352h2.092a3.992 3.992 0 0 1 3.81 2.783Z"
      opacity={0.4}
    />
  </svg>
);
