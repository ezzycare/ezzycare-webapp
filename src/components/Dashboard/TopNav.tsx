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
    <div className="w-full h-20 bg-surface-card px-5 flex items-center justify-end">
      {/* <DatePicker /> */}
      <div ref={dropdownRef} className="relative">
        <button
          className="bg-gray-2 px-3 py-3 rounded-xl flex items-center gap-2 cursor-pointer border border-transparent hover:border-gray-300 transition"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          <CalendarIconLocal />

          <span className="text-sm font-medium text-text-alt">
            {selectedDate}
          </span>

          <ChevronDownIcon
            className={`transition-all duration-300 ease-in-out ${
              dropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 w-[320px] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
            <p className="mb-4 text-sm font-medium text-gray-500">
              Select Date
            </p>

            {/* <Calendar aria-label="Event date" className="w-full">
              <Calendar.Header className="mb-4 flex items-center justify-between">
                <Calendar.NavButton
                  slot="previous"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  ←
                </Calendar.NavButton>

                <Calendar.Heading className="text-sm font-semibold text-gray-900" />

                <Calendar.NavButton
                  slot="next"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  →
                </Calendar.NavButton>
              </Calendar.Header>

              <Calendar.Grid className="w-full border-collapse">
                <Calendar.GridHeader>
                  {(day) => (
                    <Calendar.HeaderCell className="pb-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                      {day}
                    </Calendar.HeaderCell>
                  )}
                </Calendar.GridHeader>

                <Calendar.GridBody>
                  {(date) => (
                    <Calendar.Cell
                      date={date}
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-sm text-gray-700 hover:bg-gray-100 focus:bg-black focus:text-white data-[selected]:bg-black data-[selected]:text-white data-[disabled]:opacity-30 transition cursor-pointer"
                    />
                  )}
                </Calendar.GridBody>
              </Calendar.Grid>
            </Calendar> */}
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
