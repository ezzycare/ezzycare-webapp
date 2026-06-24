'use client';

import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { cn } from '@/lib/utils';
import { PatientType } from '@/types/patients';
import { BaseTableProps, Column } from '@/types/table';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

const PatientsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<PatientType>> & {
  data: PatientType[];
  searchable?: boolean;
  columns?: Column<PatientType>[];
}) => {
  const { push } = useRouter();
  const localColumns = [
    {
      field: 'name',
      label: 'Name',
      sortable: false,
    },

    {
      field: 'email',
      label: 'Email',
      sortable: false,
    },
    {
      field: 'phoneNumber',
      label: 'Phone',
      sortable: false,
    },

    {
      field: 'lastVisit',
      label: 'Last Visit',
    },
    {
      field: 'bookings',
      label: 'Bookings',
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
    },

    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: PatientType) => (
        <>
          <div
            className={cn(
              `inline-flex gap-2 rounded-full cursor-pointer px-2 py-1 text-xs font-medium border border-border1`
            )}
            onClick={() => push('/dashboard/patients/' + row.id)}
          >
            <EyeOpenIcon className="text-gray-500" />
            <span>View details</span>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<PatientType>
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

export default PatientsTable;
