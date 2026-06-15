'use client';

import BaseTable from '@/components/Base/Table';
import { BookingType } from '@/types/bookings';
import { DoctorType } from '@/types/doctors';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BookingTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<BookingType>> & {
  data: BookingType[];
  searchable?: boolean;
  columns?: Column<BookingType>[];
}) => {
  const { push } = useRouter();
  const [currentRow, setCurrentRow] = useState<BookingType | null>(null);

  const localColumns = [
    {
      field: 'bookingId',
      label: 'Booking ID',
      sortable: false,
    },

    {
      field: 'patientName',
      label: 'Patient Name',
      sortable: false,
    },
    {
      field: 'doctor',
      label: 'Doctor',
      sortable: false,
      render: (value: DoctorType) => <span>{value.name}</span>,
    },
    {
      field: 'appointmentDate',
      label: 'Appointment Date',
      sortable: false,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => (
        <div
          className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${statusColor(
            value as StatusType
          )}`}
        >
          {value}
        </div>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: BookingType) => (
        <div className="flex items-center gap-1.5">
          <button
            className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              // setCurrentRow(row);
              push(`/dashboard/bookings/${row.id}`);
            }}
          >
            <EyeOpenIcon className="text-gray-500" />
            <span>View details</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<BookingType>
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

export default BookingTable;
