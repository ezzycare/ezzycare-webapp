'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import {
  AnalyticsIconLocal,
  CalendarIconLocal,
  CreditCardIconLocal,
  HomeIconLocal,
  HospitalIconLocal,
  LogoutIconLocal,
  MenuBoardIconLocal,
  NotificationIconLocal,
  SettingsIconLocal,
  SideBarBaseIcon,
  StethoscopeIconLocal,
  UserIconLocal,
} from '@/icons/DashboardNavIcons';
import FullLogo from '@/icons/FullLogo';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const dashNavItems = [
  { name: 'Dashboard Overview', href: '/dashboard', icon: HomeIconLocal },
  { name: 'Hospitals', href: '/dashboard/hospitals', icon: HospitalIconLocal },
  { name: 'Doctors', href: '/dashboard/doctors', icon: StethoscopeIconLocal },
  { name: 'Agents', href: '/dashboard/agents', icon: UserIconLocal },
  { name: 'Patients', href: '/dashboard/patients', icon: UserIconLocal },
  { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarIconLocal },
  {
    name: 'Notifications',
    href: '/dashboard/notifications',
    icon: NotificationIconLocal,
  },
  {
    name: 'Verifications',
    href: '/dashboard/verifications',
    icon: MenuBoardIconLocal,
  },
  { name: 'Approvals', href: '/dashboard/approvals', icon: MenuBoardIconLocal },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIconLocal },
  { name: 'Analytics', href: '/dashboard/analytics', icon: AnalyticsIconLocal },
  { name: 'Settings', href: '/dashboard/settings', icon: SettingsIconLocal },
  { name: 'Admin Management', href: '/dashboard/admin', icon: UserIconLocal },
];

const userData = {
  name: 'John Doe',
  role: 'Admin',
  email: 'F7i0k@example.com',
};

const DashNav = ({
  sidebarOpen,
  setSideBarOpen,
}: {
  sidebarOpen: boolean;
  setSideBarOpen: (sidebarOpen: boolean) => void;
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile(1023);

  const showSidebar = !isMobile || (isMobile && sidebarOpen);

  useEffect(() => {
    setSideBarOpen(false);
  }, [isMobile]);

  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 lg:relative lg:w-72.5 inset-0 z-50',
        isMobile && sidebarOpen
          ? 'bg-black/20 w-full left-0 right-0 cursor-pointer'
          : 'pointer-events-none'
      )}
      onClick={() => setSideBarOpen(false)}
    >
      <div
        className={cn(
          `w-72.5 min-h-screen overflow-y-auto flex flex-col
          bg-surface-card border-r border-r-gray-3
          transition-transform duration-500
          lg:relative lg:left-0 pointer-events-auto`,
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <FullLogo
          className="h-10.25 w-36 my-5 ml-12.5"
          onClick={() => setSideBarOpen(false)}
        />
        <nav className="flex flex-col gap-2.5">
          {dashNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setSideBarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 text-text-alt font-medium text-sm hover:text-text transition-colors duration-200 pl-7 py-2.5 rounded-lg',
                  active && 'bg-blue-3a text-blue-11a'
                )}
              >
                <item.icon />
                {item.name}
              </Link>
            );
          })}
          <div
            className={cn(`
              flex items-center gap-3 text-text-alt font-medium text-sm hover:text-text
              transition-colors duration-200 pl-7 py-2.5 rounded-lg cursor-pointer
            `)}
          >
            <LogoutIconLocal />
            Logout
          </div>
        </nav>
        <div className="w-full flex items-center gap-2 px-4 py-2.5 mt-auto">
          <SideBarBaseIcon />
          <div>
            <h2 className="text-sm font-semibold">{userData.role}</h2>
            <p className="text-xs text-text-muted">{userData.email}</p>
          </div>
          <ChevronsUpDown size={18} color="gray" className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default DashNav;
