'use client';

import BaseTable from '@/components/Base/Table';
import { BaseTableProps, Column } from '@/types/table';
import { type RoleType } from '@/types/team';
import { roleColor, RoleColorType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import { Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import RoleDetailsModal from './RoleDetailsModal';

const RolesTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<RoleType>> & {
  data: RoleType[];
  searchable?: boolean;
  columns?: Column<RoleType>[];
}) => {
  const [currentRow, setCurrentRow] = useState<RoleType | null>(null);
  const localColumns = [
    {
      field: 'name',
      label: 'role Name',
      sortable: false,
      render: (value: string) => (
        <div
          className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${roleColor(
            value?.toLowerCase() as RoleColorType
          )}`}
        >
          {value}
        </div>
      ),
    },
    {
      field: 'creatorName',
      label: 'Created By',
    },
    {
      field: 'creatorEmail',
      label: 'Created Email',
    },
    {
      field: 'createdAt',
      label: 'Data Created',
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: RoleType) => (
        <>
          <div className="flex items-center gap-2">
            <button
              className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-border2 cursor-pointer`}
              onClick={() => setCurrentRow(row)}
            >
              <EyeOpenIcon className="text-gray-500" />
              <span>View</span>
            </button>
            <Edit2 size={18} className="text-gray-text" />
            <Trash2 size={18} className="text-gray-text" />
          </div>
        </>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<RoleType>
        data={data}
        searchable={searchable || false}
        columns={columns || localColumns}
        {...props}
      >
        {props?.children}
      </BaseTable>

      <RoleDetailsModal
        data={currentRow || ({} as RoleType)}
        openModal={!!currentRow}
        setOpenModal={() => setCurrentRow(null)}
      />
    </div>
  );
};

export default RolesTable;
