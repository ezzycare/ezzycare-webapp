'use client';

import { handleLogout } from '@/apiQuery/auth/logout';
import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useIsMobile } from '@/hooks/useIsMobile';
import { LogoutIconLocal, SideBarBaseIcon } from '@/icons/DashboardNavIcons';
import FullLogo from '@/icons/FullLogo';
import { cn } from '@/lib/utils';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { dashNavItems, getAccountNavItems } from '@/utils/route';
import clsx from 'clsx';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

const SideNav = ({
  sidebarOpen,
  setSideBarOpen,
  accountType,
}: {
  sidebarOpen: boolean;
  setSideBarOpen: (sidebarOpen: boolean) => void;
  accountType: ACCOUNT_TYPE;
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile(1023);

  const user = useAuthStore((state: AuthStore) => state.user);
  const email = user?.email ?? '';

  const accountNavItems = useMemo(
    () => (accountType ? getAccountNavItems(accountType) : []),
    [accountType]
  );

  const handleLogoutUser = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const accessibleNavItems = useMemo(() => {
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
        'fixed top-0 bottom-0 lg:fixed lg:w-72.5 inset-0 z-50',
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
          <button
            type="button"
            onClick={handleLogoutUser}
            className={cn(
              'flex items-center gap-3 text-text-alt font-medium text-sm hover:text-text',
              'transition-colors duration-200 pl-7 py-2.5 rounded-lg cursor-pointer w-full text-left'
            )}
          >
            <LogoutIconLocal />
            Logout
          </button>
        </nav>
        <div className="w-full flex items-center gap-2 px-4 py-2.5 mt-auto">
          <SideBarBaseIcon />
          <div>
            <h2 className="text-sm font-semibold">{accountType}</h2>
            <p className="text-xs text-text-muted">{email}</p>
          </div>
          <ChevronsUpDown size={18} color="gray" className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default SideNav;
