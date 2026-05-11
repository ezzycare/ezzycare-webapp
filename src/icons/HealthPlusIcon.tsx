import React from 'react';

const HealthPlusIcon = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={13}
    viewBox="0 0 12 13"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.5 1a.5.5 0 0 0-.5.5v2.25a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0-.5.5v2.985a.5.5 0 0 0 .5.5h2a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-2a.5.5 0 0 1-.5-.5V1.5a.5.5 0 0 0-.5-.5h-3ZM3 1.5A1.5 1.5 0 0 1 4.5 0h3A1.5 1.5 0 0 1 9 1.5v1.734h1.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H9v1.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-1.5H1.5a1.5 1.5 0 0 1-1.5-1.5V4.751a1.5 1.5 0 0 1 1.5-1.5H3V1.5Z"
    />
  </svg>
);

export default HealthPlusIcon;
