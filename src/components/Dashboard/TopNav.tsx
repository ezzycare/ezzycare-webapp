'use client';

import { useClickOutside } from '@/hooks/useClickoutside';
import {
  CalendarIconLocal,
  NotificationDarkIconLocal,
} from '@/icons/DashboardNavIcons';
import { getInitials } from '@/utils/helper';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import React from 'react';
import { Calendar } from '@heroui/react';

const TopNav = () => {
  const [selectedDate, setSelectedDate] = React.useState('March 12, 2025');
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const dropdownRef = useClickOutside(() => {
    setDropdownOpen(false);
  });

  const userData = {
    name: 'John Doe',
    role: 'Admin',
    email: 'F7i0k@example.com',
  };

  const initials = getInitials(userData.name);

  return (
    <div className="w-full h-20 bg-foreground px-5 flex items-center justify-end">
      {/* custom dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          className="bg-gray-2 px-2 py-3 rounded-xl flex items-center gap-2 cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <CalendarIconLocal />
          <span className="text-sm font-medium text-text-alt">
            {selectedDate}
          </span>
          <ChevronDownIcon
            className={` transition-all duration-300 ease-in-out ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* open */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 w-75 mt-2 bg-foreground rounded-xl shadow-lg p-4 border border-gray-2">
            <p className="text-sm text-text-muted mb-2">Select Date</p>

            <Calendar aria-label="Event date">
              <Calendar.Header className="flex items-center mb-4">
                <Calendar.Heading />
                <Calendar.NavButton slot="previous" className="ml-auto" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(date) => <Calendar.Cell date={date} />}
                </Calendar.GridBody>
              </Calendar.Grid>
            </Calendar>
          </div>
        )}
      </div>

      <div className="bg-gray-2 w-10 h-10 rounded-full flex items-center justify-center ml-3 mr-2">
        <NotificationDarkIconLocal />
      </div>
      <div className="flex items-center gap-2">
        <p
          className={clsx(
            'bg-blue-11a w-10 h-10 rounded-full flex items-center justify-center',
            'uppercase text-sm text-foreground tracking-wider'
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
