/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import BaseTable from '@/components/Base/Table';
import { ChatIconLocal } from '@/icons/DashboardIcons';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { CareSeekerAppointmentType } from '@/types/appointments';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CareSeekerAppointmentsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<CareSeekerAppointmentType>> & {
  data: CareSeekerAppointmentType[];
  searchable?: boolean;
  columns?: Column<CareSeekerAppointmentType>[];
}) => {
  const { push } = useRouter();
  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );
  const [currentRow, setCurrentRow] =
    useState<CareSeekerAppointmentType | null>(null);

  console.log({ data });

  const localColumns = [
    {
      field: 'user',
      label: 'Doctor',
      sortable: false,
      render: (value: DoctorProfile) => (
        <span>{`Dr. ${value.firstName} ${value.lastName}`}</span>
      ),
    },

    {
      field: 'age',
      label: 'Specialty',
      sortable: false,
      render: (_: any, row: CareSeekerAppointmentType) => {
        return (
          <span>
            {
              categories.find((c) =>
                [c.id, c.parentId].includes(row.user?.categoryId || '')
              )?.name
            }
          </span>
        );
      },
    },
    {
      field: 'appointmentDate',
      label: 'Appointment Date',
      sortable: false,
      render: (value: string) => {
        return <span>{dayjs(value).format('MMM DD, YYYY HH:mm A')}</span>;
      },
    },
    {
      field: 'uid',
      label: 'Location',
      sortable: false,
      render: (_: any, row: CareSeekerAppointmentType) => {
        return <span>{row?.user?.userDetails?.address}</span>;
      },
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => (
        <div
          className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${statusColor(
            value?.toLowerCase() as StatusType
          )}`}
        >
          {value?.toLowerCase()}
        </div>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (_: any, row: CareSeekerAppointmentType) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'COMPLETED' ? (
            <button
              className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-text-alt cursor-pointer`}
              onClick={() => {
                push(`/dashboard/appointments/${row.id}`);
              }}
            >
              <ChatIconLocal />
              Chat
            </button>
          ) : (
            <button
              className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-text-alt cursor-pointer`}
              onClick={() => {
                setCurrentRow(row);
              }}
            >
              Cancel
            </button>
          )}
          <button
            className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:opacity-80
                text-xs text-surface-card bg-blue-11 font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              push(`/dashboard/appointments/${row.id}`);
            }}
          >
            <EyeOpenIcon />
            <span>View details</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<CareSeekerAppointmentType>
        data={data}
        searchable={searchable || false}
        columns={columns || localColumns}
        {...props}
      >
        {props?.children}
      </BaseTable>
    </div>
  );
};

export default CareSeekerAppointmentsTable;
