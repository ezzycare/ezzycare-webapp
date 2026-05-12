'use client';

import BaseTable from '@/components/Base/Table';
import { cn } from '@/lib/utils';
import { HospitalType } from '@/types/hospitals';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import HospitalDetailsModal from './HospitalDetailsModal';

const HospitalsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<HospitalType>> & {
  data: HospitalType[];
  searchable?: boolean;
  columns?: Column<HospitalType>[];
}) => {
  const [currentRow, setCurrentRow] = useState<HospitalType | null>(null);
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
      field: 'phoneNumber',
      label: 'Phone number',
    },
    {
      field: 'address',
      label: 'Address',
    },
    {
      field: 'status',
      label: 'Status',
      // sortable: true,
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

      render: (value: string, row: HospitalType) => (
        <>
          {row.status === 'pending' ? (
            <div className="flex items-center gap-1.5">
              <button
                className={cn(`
                  flex items-center justify-center rounded-2xl 
                  px-1.5 py-1 text-xs font-medium border border-blue-3a hover:bg-gray-3a/50
                  text-text-muted cursor-pointer
                `)}
              >
                Reject
              </button>
              <button
                className={cn(`
                  flex items-center justify-center rounded-2xl 
                  px-1.5 py-1 text-xs font-medium
                  text-primary bg-blue-3a hover:bg-blue-3a/50 cursor-pointer
                `)}
              >
                Approve
              </button>
              <button
                className={cn(`
                  flex items-center justify-center rounded-sm 
                  px-1.5 py-1 text-xs font-medium bg-gray-3 hover:bg-gray-3a 
                  cursor-pointer group
                `)}
              >
                <ChevronRight
                  size={13}
                  className="text-text-muted group-hover:scale-110"
                />
              </button>
            </div>
          ) : (
            <button
              className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
              onClick={() => setCurrentRow(row)}
            >
              <EyeOpenIcon className="text-gray-500" />
              <span>View</span>
            </button>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<HospitalType>
        data={data}
        searchable={searchable || false}
        columns={columns || localColumns}
        {...props}
      >
        {props?.children}
      </BaseTable>

      <HospitalDetailsModal
        data={currentRow || ({} as HospitalType)}
        openModal={!!currentRow}
        setOpenModal={() => setCurrentRow(null)}
      />
    </div>
  );
};

export default HospitalsTable;
