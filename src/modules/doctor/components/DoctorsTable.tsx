'use client';

import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { cn } from '@/lib/utils';
import { DoctorType } from '@/types/doctors';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

const DoctorsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<DoctorType>> & {
  data: DoctorType[];
  searchable?: boolean;
  columns?: Column<DoctorType>[];
}) => {
  const { push } = useRouter();
  const localColumns = [
    {
      field: 'name',
      label: "Doctor's name",
      sortable: false,
    },

    {
      field: 'email',
      label: 'Email',
      sortable: false,
    },
    {
      field: 'phoneNumber',
      label: 'Phone number',
      sortable: false,
    },

    {
      field: 'experience',
      label: 'Experience',
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
    },
    {
      field: 'assignedHospital',
      label: 'Assigned Hospital',
      render: (value: string | undefined) => {
        if (!value) {
          return (
            <div
              className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${statusColor(
                'not assigned' as StatusType
              )}`}
            >
              Not assigned
            </div>
          );
        }

        return <span suppressHydrationWarning>{value}</span>;
      },
    },

    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: DoctorType) => (
        <>
          <div
            className={cn(
              `inline-flex gap-2 rounded-full cursor-pointer px-2 py-1 text-xs font-medium border border-border1`
            )}
            onClick={() => push('/dashboard/doctors/' + row.id)}
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
      <BaseTable<DoctorType>
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

export default DoctorsTable;
