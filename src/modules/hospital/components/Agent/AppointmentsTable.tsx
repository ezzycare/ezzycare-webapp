'use client';

import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { NotificationDarkIconLocal } from '@/icons/DashboardNavIcons';
import { BookingType } from '@/types/bookings';
import { DoctorType } from '@/types/doctors';
import { BaseTableProps, Column } from '@/types/table';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AppointmentsTable = ({
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
      field: 'patientName',
      label: 'Patient Name',
      sortable: false,
    },
    {
      field: 'hospital',
      label: 'Doctor / Hospital',
      sortable: false,
      render: (value: DoctorType) => <span>{value.name}</span>,
    },
    {
      field: 'appointmentDate',
      label: 'Time',
      sortable: false,
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
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
            <span>View</span>
          </button>
          <button
            className={`inline-flex gap-1 items-center rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              // setCurrentRow(row);
            }}
          >
            <NotificationDarkIconLocal
              width={14}
              height={14}
              className="text-gray-500"
            />
            <span>Remind</span>
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

export default AppointmentsTable;
