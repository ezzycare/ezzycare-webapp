'use client';

import { handleLogout } from '@/apiQuery/auth/logout';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { useIsMobile } from '@/hooks/useIsMobile';
import { LogoutIconLocal, SideBarBaseIcon } from '@/icons/DashboardNavIcons';
import FullLogo from '@/icons/FullLogo';
import { cn } from '@/lib/utils';
import { dashNavItems } from '@/utils/route';
import clsx from 'clsx';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

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

  const { accountType, accountNavItems } = useGetAccountType();

  const accessibleNavItems = useMemo(() => {
    console.log({ accountNavItems });
    return dashNavItems.filter(
      (item) =>
        !item.name?.includes('settings') && accountNavItems?.includes(item.href)
    );
  }, [accountNavItems]);

  const showSidebar = !isMobile || (isMobile && sidebarOpen);

  useEffect(() => {
    setSideBarOpen(false);
  }, [isMobile]);

  return (
    <div
      className={cn(
        'absolute top-0 bottom-0 lg:fixed lg:w-72.5 inset-0 z-50',
        isMobile && sidebarOpen
          ? 'bg-black/20 w-full left-0 right-0 cursor-pointer'
          : 'pointer-events-none'
      )}
      onClick={() => setSideBarOpen(false)}
    >
      <div
        className={cn(
          `w-72.5 min-h-screen flex flex-col
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
        <nav className="flex flex-col gap-2.5 max-h-[90vh] overflow-y-auto">
          {accessibleNavItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && setSideBarOpen(false)}
                className={clsx(
                  'flex items-center gap-3  font-medium text-sm hover:text-text transition-colors duration-200 pl-7 py-2.5 rounded-lg',
                  active ? 'bg-blue-3a text-blue-11a' : 'text-text-alt'
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
          <div
            className={cn(`
              flex items-center gap-3 text-text-alt font-medium text-sm hover:text-text
              transition-colors duration-200 pl-7 py-2.5 rounded-lg cursor-pointer
            `)}
            onClick={handleLogout}
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
