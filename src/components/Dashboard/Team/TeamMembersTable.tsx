'use client';

import BaseTable from '@/components/Base/Table';
import { BaseTableProps, Column } from '@/types/table';
import { type TeamMemberType } from '@/types/team';
import {
  roleColor,
  RoleColorType,
  statusColor,
  StatusType,
} from '@/utils/helper';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import EditTeamMemberModal from './EditTeamMemberModal';

const TeamMembersTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<TeamMemberType>> & {
  data: TeamMemberType[];
  searchable?: boolean;
  columns?: Column<TeamMemberType>[];
}) => {
  const [currentRow, setCurrentRow] = useState<TeamMemberType | null>(null);
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
      field: 'role',
      label: 'Role',
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
      field: 'lastActive',
      label: 'Last Active',
    },

    {
      field: 'actions',
      label: 'Actions',

      render: (value: string, row: TeamMemberType) => (
        <>
          <button
            className={`inline-flex gap-2 rounded-full px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium cursor-pointer`}
            onClick={() => setCurrentRow(row)}
          >
            <EllipsisVertical size={18} className="text-gray-text" />
          </button>
        </>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<TeamMemberType>
        data={data}
        searchable={searchable || false}
        columns={columns || localColumns}
        {...props}
      >
        {props?.children}
      </BaseTable>

      <EditTeamMemberModal
        data={currentRow || ({} as TeamMemberType)}
        openModal={!!currentRow}
        setOpenModal={() => setCurrentRow(null)}
      />
    </div>
  );
};

export default TeamMembersTable;
