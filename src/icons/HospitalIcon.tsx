import * as React from 'react';

const HospitalIcon = ({
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
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 20.5V5.094c0-.88.672-1.594 1.5-1.594h8c.828 0 1.5.714 1.5 1.594v13.812c0 .88-.672 1.594-1.5 1.594H10Zm0 0H4.5c-.828 0-1.5-.714-1.5-1.594v-5.312C3 12.714 3.672 12 4.5 12h4c.828 0 1.5.713 1.5 1.594V20.5Zm3.5 0v-4.781c0-.88.672-1.594 1.5-1.594h1c.828 0 1.5.713 1.5 1.594V20.5m-.1-11.333h-3.6m-6.3 5.666H5.7m1.8 2.834H5.7m9.9-10.39v3.779"
    />
  </svg>
);
export default HospitalIcon;
