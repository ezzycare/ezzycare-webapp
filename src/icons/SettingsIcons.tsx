import { IconProps } from './DashboardIcons';

export const SettingsWalletIconLocal = ({ size = 18, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.125}
      d="M10.696 11.998h-3.75"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="m9.495 1.889-.023.052L7.297 6.99H5.16c-.51 0-.998.105-1.44.292l1.312-3.135.03-.075.053-.12c.015-.045.03-.09.052-.127.983-2.273 2.093-2.79 4.328-1.935Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="M13.538 7.139a3.57 3.57 0 0 0-1.058-.15H7.298L9.473 1.94l.022-.052c.113.037.218.09.33.135l1.658.697c.922.383 1.567.78 1.957 1.26.075.09.135.173.188.27.067.105.12.21.15.323.03.067.052.135.067.195.203.63.083 1.402-.307 2.37Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="M16.141 10.648v1.463c0 .15-.007.3-.015.45-.142 2.617-1.605 3.937-4.38 3.937h-5.85c-.18 0-.36-.015-.532-.037-2.385-.158-3.66-1.433-3.818-3.818a4.14 4.14 0 0 1-.037-.532v-1.463a3.67 3.67 0 0 1 2.22-3.367c.45-.188.93-.293 1.44-.293h7.32c.367 0 .727.053 1.057.15a3.678 3.678 0 0 1 2.595 3.51Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="M5.032 4.146 3.72 7.281A3.67 3.67 0 0 0 1.5 10.65V8.451a4.386 4.386 0 0 1 3.532-4.305ZM16.139 8.452v2.197a3.66 3.66 0 0 0-2.595-3.502c.39-.975.502-1.74.315-2.378a.857.857 0 0 0-.068-.195 4.367 4.367 0 0 1 2.348 3.878Z"
    />
  </svg>
);

export const MedicalRecordsIconLocal = ({ size = 18, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path fill="#fff" fillOpacity={0.01} d="M0 0h18v18H0z" />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M16.8 13.2V4.8H1.2v8.4h15.6ZM18 4.8v8.4a1.2 1.2 0 0 1-1.2 1.2H1.2A1.2 1.2 0 0 1 0 13.2V4.8a1.2 1.2 0 0 1 1.2-1.2h15.6A1.2 1.2 0 0 1 18 4.8ZM2.4 6.3a.3.3 0 0 1 .3-.3h4.2a.3.3 0 0 1 .3.3v5.4a.3.3 0 0 1-.3.3H2.7a.3.3 0 0 1-.3-.3V6.3ZM9 8.4a.6.6 0 0 0 0 1.2h3.6a.6.6 0 0 0 0-1.2H9Zm-.6 3a.6.6 0 0 1 .6-.6h6a.6.6 0 0 1 0 1.2H9a.6.6 0 0 1-.6-.6ZM9 6a.6.6 0 0 0 0 1.2h4.8a.6.6 0 0 0 0-1.2H9Z"
      clipRule="evenodd"
    />
  </svg>
);

export const ShareIconLocal = ({ size = 18, ...props }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 18 18"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.125}
      d="M12.72 4.627a6.472 6.472 0 0 1 2.745 4.612M2.617 9.277a6.451 6.451 0 0 1 2.7-4.613M6.143 15.705c.87.443 1.86.69 2.902.69 1.005 0 1.95-.225 2.798-.637M9.045 5.775a2.085 2.085 0 1 0 0-4.17 2.085 2.085 0 0 0 0 4.17ZM3.623 14.94a2.085 2.085 0 1 0 0-4.17 2.085 2.085 0 0 0 0 4.17ZM14.377 14.94a2.085 2.085 0 1 0 0-4.17 2.085 2.085 0 0 0 0 4.17Z"
    />
  </svg>
);

export const TopUpIconLocal = ({ size = 40, ...props }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
      {...props}
    >
      <path fill="#fff" fillOpacity={0.01} d="M0 0h40v40H0z" />
      <path
        fill="#00DB66"
        fillOpacity={0.137}
        d="M0 12C0 5.373 5.373 0 12 0h16c6.627 0 12 5.373 12 12v16c0 6.627-5.373 12-12 12H12C5.373 40 0 34.627 0 28V12Z"
      />
      <path fill="#fff" fillOpacity={0.01} d="M11 11h18v18H11z" />
      <path
        fill="#008051"
        fillRule="evenodd"
        d="M24.624 15.375a.6.6 0 0 1 0 .849l-7.975 7.975H21.8a.6.6 0 0 1 0 1.2h-6.6a.6.6 0 0 1-.6-.6v-6.6a.6.6 0 0 1 1.2 0v5.152l7.976-7.976a.6.6 0 0 1 .848 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
