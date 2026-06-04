/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Pagination from '@/components/Base/Pagination';
import AgentsTable from '@/components/Dashboard/Agent/AgentsTable';
import CreateAgentModal from '@/components/Dashboard/Agent/CreateAgentModal';
import { Button } from '@/components/Ui/Button';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { cn } from '@/lib/utils';
import { AgentType } from '@/types/agents';
import { PlusIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';

const Agents = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const { accountType } = useGetAccountType();

  const isHospital = useMemo(() => accountType === 'HOSPITAL', [accountType]);
  const isAdmin = useMemo(() => accountType === 'ADMIN', [accountType]);

  const totals = [
    {
      title: 'Total Agents',
      value: '166',
      titleColor: 'text-text',
    },
    {
      title: 'Active Agents',
      value: '46',
      titleColor: 'text-primary',
    },
    {
      title: 'Pending',
      value: '100',
      titleColor: 'text-text',
    },
    {
      title: 'Inactive Agents',
      value: '10',
      titleColor: 'text-text',
    },
    {
      title: 'Suspended Agents',
      value: '10',
      titleColor: 'text-error',
    },
  ];

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'active';
    if (rand < 0.8) return 'pending';
    return 'suspended';
  };

  const agents: AgentType[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: 'John Smith',
    email: 'jsmith@gmail.com',
    phoneNumber: '08069192646',
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: getStatus(),
  }));

  const meta = {
    page: 1,
    pageSize: 10,
    pageCount: Math.round(agents.length / 10),
    total: agents.length,
  };
  const paginatedData = (): AgentType[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;
    return agents.slice(startIndex, endIndex);
  };

  const filters = [
    {
      label: 'Status',
      key: 'status',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Suspended',
          value: 'suspended',
        },
      ],
      fn: (row: AgentType, value: any) => row.status === value,
    },
  ];

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-text text-2xl font-medium">Agents</h3>
          <p className="text-sm text-text-muted">
            Manage healthcare agents and their access to the platform
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {isAdmin && (
            <Button
              onClick={() => setCreateModal(true)}
              className="bg-blue-11a! hover:bg-blue-11a/80 gap-2"
              variant="primary"
            >
              Create New Agent
            </Button>
          )}
          {isHospital && (
            <Button
              onClick={() => setCreateModal(true)}
              className="bg-blue-11a! hover:bg-blue-11a/80 gap-2"
              variant="primary"
            >
              <PlusIcon size={18} />
              Add Agent
            </Button>
          )}
        </div>
      </div>
      <div
        className={cn(`
        grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
        lg:grid-cols-5 gap-4 mt-4 justify-between items-center`)}
      >
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <h2 className={`text-xs font-400 uppercase ${item.titleColor}`}>
                {item.title}
              </h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-card pb-5">
        <AgentsTable
          data={paginatedData()}
          searchable={true}
          searchPlaceholder="Search by name, email, specialization, or qualification..."
          searchContainerClassName="max-w-[404px]!"
          filters={filters}
        ></AgentsTable>

        {meta && meta?.pageCount > 1 && (
          <div className="mt-auto pt-10">
            <Pagination
              pages={meta.pageCount}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}

        <CreateAgentModal
          openModal={createModal}
          setOpenModal={setCreateModal}
        ></CreateAgentModal>
      </div>
    </div>
  );
};

export default Agents;
