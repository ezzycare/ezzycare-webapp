import React from 'react';

const TickCircle = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    className={className}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M10 18.958c-4.941 0-8.958-4.016-8.958-8.958S5.059 1.042 10 1.042c4.942 0 8.959 4.016 8.959 8.958S14.942 18.958 10 18.958Zm0-16.666C5.75 2.292 2.292 5.75 2.292 10S5.75 17.708 10 17.708 17.71 14.25 17.71 10 14.25 2.292 10 2.292Z"
    />
    <path
      fill="currentColor"
      d="M8.816 12.983a.625.625 0 0 1-.441-.183l-2.359-2.358a.629.629 0 0 1 0-.884.629.629 0 0 1 .884 0l1.916 1.917L13.1 7.192a.629.629 0 0 1 .883 0 .629.629 0 0 1 0 .883L9.258 12.8a.625.625 0 0 1-.442.183Z"
    />
  </svg>
);
export default TickCircle;
