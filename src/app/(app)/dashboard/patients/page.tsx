/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Pagination from '@/components/Base/Pagination';
import IconBase from '@/components/layout/IconBase';
import PatientsTable from '@/modules/hospital/components/Patient/PatientsTable';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { cn } from '@/lib/utils';
import { PatientType } from '@/types/patients';
import React from 'react';

const Patients = () => {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totals = [
    {
      title: 'Total Patients',
      value: '10,000',
      icon: <UserIconLocal className="text-primary" />,
    },
    {
      title: 'Upcoming Patients',
      value: '9000',
      icon: <UserIconLocal className="text-pink-10" />,
    },
    {
      title: 'Completed Patients',
      value: '1000',
      icon: <UserIconLocal className="text-primary" />,
    },
  ];

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'active';
    return 'inactive';
  };

  const patients: PatientType[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: 'John Doe',
    email: 'emoryhospital@gmail.com',
    phoneNumber: '08169192646',
    lastVisit: 'May 08, 2026',
    // eslint-disable-next-line react-hooks/purity
    bookings: Math.round(Math.random() * 10),
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: getStatus(),
  }));

  const meta = {
    page: 1,
    pageSize: 10,
    pageCount: Math.round(patients.length / 10),
    total: patients.length,
  };
  const paginatedData = (): PatientType[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;
    return patients.slice(startIndex, endIndex);
  };

  const filters = [
    {
      label: 'All Status',
      key: 'status',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      fn: (row: PatientType, value: any) => row.status === value,
    },
  ];

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-text text-2xl font-medium">
            Patients Management
          </h3>
          <p className="text-sm text-text-muted">
            View and manage patient records and information
          </p>
        </div>
      </div>
      <div
        className={cn(`
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        gap-4 mt-4 justify-between items-center`)}
      >
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <IconBase>{item.icon}</IconBase>
            <div className="flex flex-col gap-2">
              <h2 className={`text-xs font-400 uppercase`}>{item.title}</h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-card pb-5">
        <PatientsTable
          data={paginatedData()}
          searchable={true}
          searchPlaceholder="Search by name, email, specialization, or qualification..."
          searchContainerClassName="max-w-[404px]!"
          filters={filters}
        ></PatientsTable>

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

export default Patients;
