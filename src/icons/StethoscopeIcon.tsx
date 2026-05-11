import * as React from 'react';

const StethoscopeIcon = ({
  ...props
}: {
  props?: React.SVGProps<SVGSVGElement>;
  [key: string]: unknown;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8.8 11.2a4 4 0 0 1-4-4V4a.8.8 0 0 1 .8-.8h.8a.8.8 0 0 0 0-1.6h-.8A2.4 2.4 0 0 0 3.2 4v3.2a5.584 5.584 0 0 0 2.416 4.592A7.04 7.04 0 0 1 8 16.8a5.6 5.6 0 1 0 11.2 0v-.912a3.2 3.2 0 1 0-1.6 0v.912a4 4 0 1 1-8 0 7.04 7.04 0 0 1 2.4-5.008A5.583 5.583 0 0 0 14.4 7.2V4A2.4 2.4 0 0 0 12 1.6h-.8a.8.8 0 1 0 0 1.6h.8a.8.8 0 0 1 .8.8v3.2a4 4 0 0 1-4 4Zm9.6 3.2a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2Z"
    />
  </svg>
);
export default StethoscopeIcon;
