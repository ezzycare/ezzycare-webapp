type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const ClockIconLocal = ({ size = 20, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="m13.092 12.65-2.584-1.541c-.45-.267-.816-.909-.816-1.434V6.26"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M3.333 5A8.336 8.336 0 0 0 10 18.333c4.6 0 8.333-3.733 8.333-8.333S14.6 1.667 10 1.667a8.22 8.22 0 0 0-3.358.708"
    />
  </svg>
);

export const InfoInvertedIconLocal = ({ size = 20, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      fill="#00432C"
      d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0Zm1 15H9v-2h2v2Zm0-4H9V5h2v6Z"
    />
  </svg>
);

export const DepartmentIconLocal = ({ size = 20, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      clipPath="url(#a)"
    >
      <path d="M5 18.334v-15a1.667 1.667 0 0 1 1.667-1.667h6.666A1.666 1.666 0 0 1 15 3.334v15H5ZM5 10H3.333a1.667 1.667 0 0 0-1.667 1.667v5a1.667 1.667 0 0 0 1.667 1.666H5" />
      <path d="M15 7.5h1.667a1.667 1.667 0 0 1 1.666 1.667v7.5a1.667 1.667 0 0 1-1.666 1.666H15M8.334 5h3.333M8.334 8.333h3.333M8.334 11.667h3.333M8.334 15h3.333" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="none" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const MapFilledLocal = ({ size = 15, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 15 15"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M7.039 13.834S2.5 10.012 2.5 6.25a5 5 0 1 1 10 0c0 3.761-4.539 7.584-4.539 7.584a.7.7 0 0 1-.922 0ZM7.5 8.438a2.188 2.188 0 1 0 0-4.375 2.188 2.188 0 0 0 0 4.375Z"
      clipRule="evenodd"
    />
  </svg>
);
