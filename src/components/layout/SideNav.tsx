'use client';

import { handleLogout } from '@/apiQuery/auth/logout';
import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useIsMobile } from '@/hooks/useIsMobile';
import { LogoutIconLocal, SideBarBaseIcon } from '@/icons/DashboardNavIcons';
import FullLogo from '@/icons/FullLogo';
import { cn } from '@/lib/utils';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { dashNavItems, getAccountNavItems } from '@/utils/route';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import clsx from 'clsx';
import { ChevronRight, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

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

  const doctorUser = useAuthStore((state) => state.doctorUser);

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
        {accountType === 'DOCTOR' && !!doctorUser?.hospitals?.length && (
          <WorkspaceSwitcher doctorUser={doctorUser} />
        )}
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

const WorkspaceSwitcher = ({ doctorUser }: { doctorUser: DoctorProfile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const hospitals = doctorUser.hospitals;

  const initials = doctorUser?.firstName
    ? `${doctorUser.firstName[0]}${doctorUser.lastName?.[0] ?? ''}`
    : '';

  if (!doctorUser?.firstName) return null;

  const handleLogoutUser = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div className="flex items-center gap-3 bg-background py-2.5 px-3 cursor-pointer hover:bg-gray-2 transition-colors mb-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-surface-card text-sm font-medium">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">{`${doctorUser.firstName} ${doctorUser.lastName}`}</h2>
            <p className="text-xs text-text-muted truncate">
              {doctorUser.email}
            </p>
          </div>
          <ChevronsUpDown
            size={18}
            className="ml-auto text-text-muted shrink-0"
          />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-72.25 p-5 rounded-none! -ml-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-text-muted text-sm">Switch workspaces</h2>
          <div className="mt-2 space-y-2">
            {hospitals?.map((hospital) => (
              <div
                key={hospital.id}
                className="flex items-center gap-3 border border-border2 rounded-lg py-2.5 px-3 cursor-pointer hover:bg-gray-2 transition-colors"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-surface-card text-xs font-medium uppercase">
                  {hospital.hospitalName.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-medium truncate">
                    {hospital.hospitalName}
                  </h3>
                </div>
                <ChevronRight
                  size={18}
                  className="ml-auto text-text-muted shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
