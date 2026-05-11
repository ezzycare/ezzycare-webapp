import React from 'react';

const ArrowTopRight = ({
  ...props
}: {
  props?: React.SVGProps<SVGSVGElement>;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path fill="currentColor" fillOpacity={0.01} d="M0 0h20v20H0z" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M4.862 15.138a.667.667 0 0 1 0-.943l8.862-8.862H8A.667.667 0 0 1 8 4h7.334a.667.667 0 0 1 .666.667V12a.667.667 0 1 1-1.333 0V6.276l-8.862 8.862a.667.667 0 0 1-.943 0Z"
      clipRule="evenodd"
    />
  </svg>
);
export default ArrowTopRight;
