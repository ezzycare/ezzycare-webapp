import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { ChatIconLocal } from '@/icons/DashboardIcons';
import {
  AnalyticsIconLocal,
  CalendarIconLocal,
  CreditCardIconLocal,
  HomeIconLocal,
  HospitalIconLocal,
  MenuBoardIconLocal,
  NotificationIconLocal,
  SettingsIconLocal,
  StethoscopeIconLocal,
  UserIconLocal,
  UsersIconLocal,
  WalletIconLocal,
} from '@/icons/DashboardNavIcons';

export const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Our Doctors', path: '/our-doctors' },
  { name: 'How it works', path: '/how-it-works' },
  { name: 'For Doctors', path: '#' },
  { name: 'For Hospitals', path: '#' },
  { name: 'Blogs', path: '/blog' },
];

export const dashNavItems = [
  { name: 'Dashboard Overview', href: '/dashboard', icon: <HomeIconLocal /> },
  {
    name: 'Hospitals',
    href: '/dashboard/hospitals',
    icon: <HospitalIconLocal />,
  },
  {
    name: 'Doctors',
    href: '/dashboard/doctors',
    icon: <StethoscopeIconLocal />,
  },
  { name: 'Agents', href: '/dashboard/agents', icon: <UserIconLocal /> },
  { name: 'Team', href: '/dashboard/team', icon: <UsersIconLocal /> },
  { name: 'Patients', href: '/dashboard/patients', icon: <UserIconLocal /> },
  {
    name: 'Bookings',
    href: '/dashboard/bookings',
    icon: <CalendarIconLocal />,
  },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: <NotificationIconLocal />,
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    icon: <MenuBoardIconLocal />,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: <ChatIconLocal />,
  },
  {
    name: 'Wallet',
    href: '/dashboard/wallet',
    icon: <WalletIconLocal />,
  },
  {
    name: 'Verifications',
    href: '/dashboard/verifications',
    icon: <MenuBoardIconLocal />,
  },
  {
    name: 'Approvals',
    href: '/dashboard/approvals',
    icon: <MenuBoardIconLocal />,
  },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: <CreditCardIconLocal />,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: <AnalyticsIconLocal />,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: <SettingsIconLocal />,
  },
  {
    name: 'Admin Management',
    href: '/dashboard/admin',
    icon: <UserIconLocal />,
  },
];

export const getAccountNavItems = (accountType: ACCOUNT_TYPE) => {
  // const TEST = true;
  // if (TEST) return dashNavItems.map((item) => item.href);
  switch (accountType) {
    case 'ADMIN':
      return [
        '',
        'hospitals',
        'doctors',
        'agents',
        'patients',
        'bookings',
        'notifications',
        'approvals',
        'payments',
        'analytics',
        'settings',
        'admin',
      ].map((val) => (val?.length ? `/dashboard/${val}` : `/dashboard`));

    case 'HOSPITAL':
      return [
        '',
        'doctors',
        // 'messages', // TODO: REMOVE
        'appointments',
        'agents',
        'patients',
        'notifications',
        'departments',
        'settings',
      ].map((val) => (val?.length ? `/dashboard/${val}` : `/dashboard`));

    case 'SEEKER':
      return [
        '',
        'appointments',
        'messages',
        'wallet',
        'profile',
        'settings',
      ].map((val) => (val?.length ? `/dashboard/${val}` : `/dashboard`));

    case 'DOCTOR':
      return [
        '',
        'appointments',
        'messages',
        'wallet',
        'profile',
        'settings',
      ].map((val) => (val?.length ? `/dashboard/${val}` : `/dashboard`));

    case 'AGENT':
      return ['', 'patients', 'notifications', 'appointments', 'settings'].map(
        (val) => (val?.length ? `/dashboard/${val}` : `/dashboard`)
      );

    default:
      return [];
  }
};

export const blockedNavItems = (accountType: ACCOUNT_TYPE) => {
  const allowed = getAccountNavItems(accountType);

  return dashNavItems
    .filter((item) => !allowed.includes(item.href))
    ?.map((item) => item.href);
};
