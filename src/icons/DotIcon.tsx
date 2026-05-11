import * as React from 'react';

const DotIcon = ({
  fill = '#ABABAB',
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={3}
    height={3}
    fill="none"
    {...props}
  >
    <rect width={3} height={3} fill={fill} rx={1.5} />
  </svg>
);
export default DotIcon;
