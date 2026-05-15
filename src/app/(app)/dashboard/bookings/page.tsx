/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Pagination from '@/components/Base/Pagination';
import BookingTable from '@/components/Dashboard/Booking/BookingTable';
import { cn } from '@/lib/utils';
import { BookingType } from '@/types/bookings';
import React from 'react';

const Bookings = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totals = [
    {
      title: 'Total Bookings',
      value: '166',
      titleColor: 'text-text',
    },
    {
      title: 'Upcoming Bookings',
      value: '46',
      titleColor: 'text-primary',
    },
    {
      title: 'Completed Bookings',
      value: '100',
      titleColor: 'text-text',
    },
    {
      title: 'Active Booking',
      value: '10',
      titleColor: 'text-success',
    },
    {
      title: 'Suspended Bookings',
      value: '10',
      titleColor: 'text-error',
    },
  ];

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'cancelled';
    if (rand < 0.8) return 'upcoming';
    if (rand < 0.6) return 'active';
    return 'completed';
  };

  const bookings: BookingType[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    bookingId: 'B001',
    patientName: 'John Smith',
    doctor: {
      id: i + 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medical.com',
      phoneNumber: '+1 (555) 123-4567',
      assignedHospital: 'Emory',
      experience: (i + 1) * 2 - i + ' years',
      specialty: 'Cardiology',
      createdAt: 'May 08, 2026 10:00 AM',
      status: 'active',
      address: 'Highlevel, Makurdi, Benue State',
      medicalCertificate: 'MD',
      practiceLicense: '12345',
      specialtyCertificate: '12345',
      licenseExpiryDate: '12 May 2035',
      qualifications: ['MD', 'FAAP'],
      university: 'University of California, San Francisco',
      dateGraduated: '12 May 2015',
      about: `Dr. Rodriguez is passionate about child health and development.`,
    },
    appointmentDate: '08069192646',
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: getStatus(),
  }));

  const meta = {
    page: 1,
    pageSize: 10,
    pageCount: Math.round(bookings.length / 10),
    total: bookings.length,
  };
  const paginatedData = (): BookingType[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;
    return bookings.slice(startIndex, endIndex);
  };

  const filters = [
    {
      label: 'Status',
      key: 'status',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Upcoming',
          value: 'upcoming',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      fn: (row: BookingType, value: any) => row.status === value,
    },
  ];

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-text text-2xl font-medium">Bookings</h3>
          <p className="text-sm text-text-muted whitespace-nowrap ">
            Monitor all appointments across the platform
          </p>
        </div>
      </div>
      <div
        className={cn(`
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-5 gap-4 mt-4 justify-between items-center`)}
      >
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <h2 className={`text-xs font-400 uppercase ${item.titleColor}`}>
                {item.title}
              </h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-card">
        <BookingTable
          data={paginatedData()}
          searchable={true}
          searchPlaceholder="Search by name, email, specialization, or qualification..."
          searchContainerClassName="max-w-[404px]!"
          filters={filters}
        ></BookingTable>

        {meta && meta?.pageCount > 1 && (
          <div className="mt-auto pt-10">
            <Pagination
              pages={meta.pageCount}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
