'use client';

import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { cn } from '@/lib/utils';
import { AgentType } from '@/types/agents';
import { BaseTableProps, Column } from '@/types/table';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AgentsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<AgentType>> & {
  data: AgentType[];
  searchable?: boolean;
  columns?: Column<AgentType>[];
}) => {
  const { push } = useRouter();
  const [currentRow, setCurrentRow] = useState<AgentType | null>(null);

  const localColumns = [
    {
      field: 'name',
      label: 'Fullname',
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
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: AgentType) => (
        <div className="flex items-center gap-1.5">
          <button
            className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              // setCurrentRow(row);
              push(`/dashboard/agents/${row.id}`);
            }}
          >
            <EyeOpenIcon className="text-gray-500" />
            <span>View details</span>
          </button>
          {row.status === 'pending' ? (
            <div className="flex items-center gap-1.5">
              <button
                className={cn(`
                  flex items-center justify-center rounded-lg 
                  px-1.5 py-1 text-xs font-medium border border-primary hover:bg-gray-3a/50
                  text-primary cursor-pointer
                `)}
              >
                Reject
              </button>
              <button
                className={cn(`
                  flex items-center justify-center rounded-lg 
                  px-1.5 py-1 text-xs font-medium
                  text-primary bg-blue-3a hover:bg-blue-3a/50 cursor-pointer
                `)}
              >
                Approve
              </button>
            </div>
          ) : (
            <button
              className={cn(`
                  flex items-center justify-center rounded-lg 
                  px-1.5 py-1 text-xs font-medium
                  text-primary bg-blue-3a hover:bg-blue-3a/50 cursor-pointer
                `)}
            >
              {row.status === 'suspended' ? 'Activate' : 'Suspend'}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<AgentType>
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

export default AgentsTable;
