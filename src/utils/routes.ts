import AnalyticsIcon from '@/icons/AnalyticsIcon';
import CustomerSupportIcon from '@/icons/CustomerSupportIcon';
import DashboardIcon from '@/icons/DashboardIcon';
import OrdersIcon from '@/icons/OrdersIcon';
import RidersIcon from '@/icons/RidersIcon';
import UsersIcon from '@/icons/UsersIcon';
import VendorNavIcon from '@/icons/VendorNavIcon';

export const sidenavRoutes = [
  {
    name: 'Dashboard',
    icon: DashboardIcon,
    path: '/dashboard',
    isActive: false,
    subRoutes: [],
  },
  {
    name: 'Vendors',
    icon: VendorNavIcon,
    path: '/dashboard/vendors',
    matchingPath: /\/dashboard\/vendors\/[A-Za-z0-9]+/,
    isActive: false,
    subRoutes: [],
  },
  {
    name: 'Orders',
    icon: OrdersIcon,
    path: '/dashboard/orders',
    isActive: false,
    navbarName: 'Orders Today',
    subRoutes: [
      { name: 'General', path: '/dashboard/orders', isActive: false, navbarName: 'Orders Today' },
      {
        name: 'Order map',
        path: '/dashboard/orders/map',
        isActive: false,
        navbarName: 'Orders Today',
      },
    ],
  },
  {
    name: 'Customer Support',
    icon: CustomerSupportIcon,
    path: '/dashboard/support',
    isActive: false,
    subRoutes: [
      { name: 'Tickets', path: '/dashboard/support/tickets', isActive: false, navbarName: '' },
      { name: 'Disputes', path: '/dashboard/support/disputes', isActive: false, navbarName: ' ' },
      { name: 'Messages', path: '/dashboard/support/messages', isActive: false, navbarName: ' ' },
    ],
  },
  {
    name: 'Riders',
    icon: RidersIcon,
    path: '/dashboard/riders',
    isActive: false,
    subRoutes: [],
  },
  {
    name: 'Analytics',
    icon: AnalyticsIcon,
    path: '/dashboard/analytics',
    isActive: false,
    subRoutes: [],
  },
  {
    name: 'User Management',
    navbarName: 'Admin Users',
    icon: UsersIcon,
    path: '/dashboard/users',
    isActive: false,
    subRoutes: [],
  },
].map((route) => ({
  ...route,
  isOpen: false,
  subRoutes:
    route.subRoutes?.map((subRoute) => ({
      ...subRoute,
      icon: route.icon,
      parentName: route.name,
    })) || [],
}));

export type NavType = (typeof sidenavRoutes)[0] & {
  isOpen?: boolean;
  parentName?: string;
  navbarName?: string;
};
