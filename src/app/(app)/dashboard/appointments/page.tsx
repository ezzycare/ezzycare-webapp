/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAppointmentsInfiniteQuery } from '@/apiQuery/healthcareAppointments/get/getAppointments';
import BounceLoader from '@/components/Base/BounceLoader';
import Pagination from '@/components/Base/Pagination';
import SpiralLoader from '@/components/Base/SpiralLoader';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import CareSeekerAppointmentsTable from '@/modules/careseeker/components/Appointments.tsx/CareSeekerAppointmentsTable';
import AppointmentsTable from '@/modules/hospital/components/Agent/AppointmentsTable';
import { CareSeekerAppointmentType } from '@/types/appointments';
import { BookingType } from '@/types/bookings';
import React, { JSX, useMemo } from 'react';

const Appointments = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeSeekerFilters, setActiveSeekerFilters] = React.useState({
    status: undefined,
  });
  const {
    appointments: appointmentsData,
    isFetching: isLoadingAppointments,
    ...restSeekerQuery
  } = useGetAppointmentsInfiniteQuery({
    ...activeSeekerFilters,
  });

  const appointments = useMemo(
    () => (appointmentsData?.length ? appointmentsData : []),
    [appointmentsData]
  );

  const { accountType } = useGetAccountType();

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

  const seekerFilters = [
    {
      label: 'Status',
      key: 'status',
      options: [
        {
          label: 'Pending',
          value: 'PENDING',
        },
        {
          label: 'Upcoming',
          value: 'UPCOMING',
        },
        {
          label: 'In Progress',
          value: 'IN_PROGRESS',
        },
        {
          label: 'Paid',
          value: 'PAID',
        },
        {
          label: 'UnPaid',
          value: 'UNPAID',
        },
        {
          label: 'Completed',
          value: 'COMPLETED',
        },
        {
          label: 'Cancelled',
          value: 'CANCELLED',
        },
      ],
      fn: (row: CareSeekerAppointmentType, value: any) => {
        setActiveSeekerFilters((prev) => ({ ...prev, status: value }));
        return true;
      },
    },
  ];

  const dashboards: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Admin</div>,
    HOSPITAL: (
      <>
        <AppointmentsTable
          data={paginatedData()}
          titleComponent={
            <h3 className="text-text text-2xl font-medium ml-3">
              Appointments
            </h3>
          }
          searchable={true}
          searchPlaceholder="Search"
          searchContainerClassName="max-w-[404px]!"
          filters={filters}
        ></AppointmentsTable>

        {meta && meta?.pageCount > 1 && (
          <div className="mt-auto pt-10">
            <Pagination
              pages={meta.pageCount}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}
      </>
    ),
    AGENT: <div>Admin</div>,
    DOCTOR: <div>Doctor Dashboard</div>,
    SEEKER: (
      <>
        <CareSeekerAppointmentsTable
          data={appointments}
          titleComponent={
            <h3 className="text-text text-2xl font-medium ml-3">
              Appointments
            </h3>
          }
          filters={seekerFilters}
          searchable={true}
          searchPlaceholder="Search"
          searchContainerClassName="max-w-[404px]!"
        />

        {restSeekerQuery.hasNextPage && (
          <div className="mt-auto pt-10">
            <Pagination
              pages={restSeekerQuery.data?.pages.length || 1}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}
      </>
    ),
  };

  if (!accountType) {
    return (
      <div className="w-full min-h-[60vh] h-full flex items-center justify-center">
        <SpiralLoader />
      </div>
    );
  }

  return (
    <div className="p-7.5 relative">
      <div className="mt-4 rounded-xl bg-surface-card pb-5 min-h-[60vh] h-full ">
        {isLoadingAppointments && <BounceLoader />}
        {dashboards[accountType]}
      </div>
    </div>
  );
};

export default Appointments;

const getStatus = (): string => {
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
  hospital: {
    name: 'Emory hospital',
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
