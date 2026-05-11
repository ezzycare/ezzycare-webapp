import * as React from 'react';
const ArrowLeft = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    className={className}
    {...props}
  >
    <path
      stroke="CurrentColor"
      // stroke="#5B6575"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.67}
      d="M12.503 6.668H.836m0 0 5.833 5.834M.836 6.668 6.669.835"
    />
  </svg>
);
export default ArrowLeft;
