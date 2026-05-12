'use client';

import { NotificationDarkIconLocal } from '@/icons/DashboardNavIcons';
import { getInitials } from '@/utils/helper';
import clsx from 'clsx';
import React, { useState } from 'react';
import DatePicker from '../Ui/DatePicker';
import { parseDate, type DateValue } from '@internationalized/date';
import dayjs from 'dayjs';

const TopNav = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD')
  );

  const userData = {
    name: 'John Doe',
    role: 'Admin',
    email: 'F7i0k@example.com',
  };

  const initials = getInitials(userData.name);

  return (
    <div className="w-full h-20 bg-surface-card px-5 flex items-center justify-end">
      <DatePicker
        defaultValue={selectedDate}
        onChange={(dateValue) => setSelectedDate(dateValue)}
      />

      <div className="bg-gray-2 w-10 h-10 rounded-full flex items-center justify-center ml-3 mr-2">
        <NotificationDarkIconLocal />
      </div>
      <div className="flex items-center gap-2">
        <p
          className={clsx(
            'bg-blue-11a w-10 h-10 rounded-full flex items-center justify-center',
            'uppercase text-sm text-surface-card tracking-wider'
          )}
        >
          {initials}
        </p>
        <div>
          <h2 className="text-sm font-semibold">{userData.role}</h2>
          <p className="text-xs text-text-muted">{userData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
