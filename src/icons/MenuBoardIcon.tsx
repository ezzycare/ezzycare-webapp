import * as React from 'react';

const MenuBoardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      stroke="#003D4C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.93}
      strokeWidth={1.25}
      d="M.917 15.892c-.367 1.216.525 2.441 1.783 2.441h10.95c.867 0 1.609-.583 1.817-1.425l2.808-11.275a1.84 1.84 0 0 0-.091-1.183 1.86 1.86 0 0 0-1.725-1.15H6.209c-.817 0-1.55.533-1.784 1.325l-2.191 7.05"
    />
    <path
      stroke="#003D4C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeOpacity={0.93}
      strokeWidth={1.25}
      d="M13.333 18.333h3.983a1.846 1.846 0 0 0 1.842-1.983L18.333 5M8.066 5.317l.867-3.6M13.65 5.325l.784-3.617M6.417 10h6.667M12.25 13.333h-.583M5.583 13.333h3.583"
    />
  </svg>
);

export default MenuBoardIcon;
