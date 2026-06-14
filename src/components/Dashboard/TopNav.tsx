'use client';

import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import { getInitials } from '@/utils/helper';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import DatePicker from '../Ui/DatePicker';
import Noti from './Notification/Noti';

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
      <div className="flex items-center gap-2">
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
    </div>
  );
};

export default TopNav;
