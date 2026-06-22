'use client';

import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import Noti from '@/modules/notifications/components/Noti';
import { useThemeStore } from '@/stores/themeStore';
import { getInitials } from '@/utils/helper';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Menu, Monitor, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import DatePicker from '../Ui/DatePicker';

const TopNav = ({
  sidebarOpen,
  setSideBarOpen,
  accountType,
  user,
}: {
  sidebarOpen: boolean;
  setSideBarOpen: (sidebarOpen: boolean) => void;
  accountType: ACCOUNT_TYPE;
  user: User | null;
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );

  const initials = user
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : '';
  const email = user?.email ?? '';

  const [isOpen, setIsOpen] = useState(false);
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: <Sun size={16} /> },
    { value: 'dark' as const, label: 'Dark', icon: <Moon size={16} /> },
    { value: 'system' as const, label: 'System', icon: <Monitor size={16} /> },
  ];

  return (
    <div className="w-full h-20 bg-surface-card px-5 flex items-center justify-end fixed z-10! top-0 left-0">
      <div
        className="mr-auto cursor-pointer block lg:hidden"
        onClick={() => setSideBarOpen(!sidebarOpen)}
      >
        <Menu className="w-6 h-6 text-text mr-auto" />
      </div>
      <DatePicker
        defaultValue={selectedDate}
        onChange={(dateValue) => setSelectedDate(dateValue)}
      />

      <Noti />
      <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger>
          <div className="flex items-center gap-2 cursor-pointer">
            <p
              className={clsx(
                'bg-blue-11a w-10 h-10 rounded-full flex items-center justify-center',
                'uppercase text-sm text-surface-card tracking-wider'
              )}
            >
              {initials}
            </p>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold">{accountType ?? ''}</h2>
              <p className="text-xs text-text-muted">{email}</p>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-48 p-2">
          <div className="flex flex-col gap-1">
            {/* <p className="text-xs text-text-muted px-3 py-1.5">Theme</p>
            {themeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer w-full text-left',
                  theme === option.value
                    ? 'bg-blue-3a text-blue-11a font-medium'
                    : 'text-text-muted hover:bg-gray-2'
                )}
              >
                {option.icon}
                {option.label}
                {theme === option.value && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-blue-11a" />
                )}
              </button>
            ))} */}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopNav;
