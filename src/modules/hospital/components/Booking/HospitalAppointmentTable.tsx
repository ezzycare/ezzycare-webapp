'use client';

import { HospitalAppointment } from '@/apiQuery/hospital/types';
import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { DoctorType } from '@/types/doctors';
import { BaseTableProps, Column } from '@/types/table';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HospitalAppointmentTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<HospitalAppointment>> & {
  data: HospitalAppointment[];
  searchable?: boolean;
  columns?: Column<HospitalAppointment>[];
}) => {
  const { push } = useRouter();
  const [currentRow, setCurrentRow] = useState<HospitalAppointment | null>(
    null
  );

  const localColumns = [
    {
      field: 'id',
      label: 'Appointment ID',
      sortable: false,
    },

    {
      field: 'client',
      label: 'Patient Name',
      sortable: false,
      render: (_: string, row: HospitalAppointment) => (
        <span>{`${row.client.firstName} ${row.client.lastName}`}</span>
      ),
    },
    {
      field: 'user',
      label: 'Doctor',
      sortable: false,
      render: (_: DoctorType, row: HospitalAppointment) => (
        <span>{`${row.user.firstName} ${row.user.lastName}`}</span>
      ),
    },
    {
      field: 'appointmentDate',
      label: 'Appointment Date',
      sortable: false,
      render: (value: string, row: HospitalAppointment) => (
        <span>{`${dayjs(value).format('MMM DD, YYYY')} ${row.appointmentTime}`}</span>
      ),
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: HospitalAppointment) => (
        <div className="flex items-center gap-1.5">
          <button
            className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              push(`/dashboard/appointments/${row.id}`);
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
      <BaseTable<HospitalAppointment>
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

export default HospitalAppointmentTable;
