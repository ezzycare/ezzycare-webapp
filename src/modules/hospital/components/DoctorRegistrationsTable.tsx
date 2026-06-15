import BaseTable from '@/components/Base/Table';
import type { DoctorRegistrationType } from '@/types/doctors';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';

const DoctorRegistrationsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<DoctorRegistrationType>> & {
  data: DoctorRegistrationType[];
  searchable?: boolean;
  columns?: Column<DoctorRegistrationType>[];
}) => {
  const localColumns = [
    {
      field: 'name',
      label: 'User',
      sortable: false,
    },

    {
      field: 'email',
      label: 'Email',
      sortable: false,
    },

    {
      field: 'createdAt',
      label: 'Registered On',
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

      render: (value: string, row: DoctorRegistrationType) => (
        <>
          <div
            className={`inline-flex gap-2 rounded-full px-2 py-1 text-xs font-medium border border-border1`}
          >
            <EyeOpenIcon className="text-gray-500" />
            <span>View</span>
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<DoctorRegistrationType>
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

export default DoctorRegistrationsTable;
