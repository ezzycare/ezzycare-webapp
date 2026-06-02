/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// import { redirect } from 'next/navigation';
import Pagination from '@/components/Base/Pagination';
import SlidingTabs from '@/components/Base/SlidingTabs';
import IconBase from '@/components/Dashboard/IconBase';
import CreateRoleModal from '@/components/Dashboard/Team/CreateRoleModal';
import EmptyTeamsTable from '@/components/Dashboard/Team/EmptyTeamsTable';
import InviteMemberModal from '@/components/Dashboard/Team/InviteMemberModal';
import RolesTable from '@/components/Dashboard/Team/RolesTable';
import TeamMembersTable from '@/components/Dashboard/Team/TeamMembersTable';
import { Button } from '@/components/Ui/Button';
import { UserIconLocal, UsersIconLocal } from '@/icons/DashboardNavIcons';
import { RoleType, TeamMemberType } from '@/types/team';
import { paginateData } from '@/utils/helper';
import { Plus, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';

const TeamManagement = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [createRoleModal, setCreateRoleModal] = useState<boolean>(false);
  const [inviteMemberModal, setInviteMemberModal] = useState<boolean>(false);

  const totals = [
    {
      title: 'Total Members',
      value: '0',
      icon: <UsersIconLocal className="" />,
      iconClassName: 'bg-blue-3a text-primary',
    },
    {
      title: 'Active Members',
      value: '0',
      icon: <UsersIconLocal className="" />,
      iconClassName: 'bg-green-3a text-success',
    },
    {
      title: 'Current Roles',
      value: '0',
      icon: <ShieldCheck size={18} className="" />,
      iconClassName: 'bg-blue-3a text-blue-11a',
    },
  ];

  const { meta, paginatedData } = paginateData<TeamMemberType>({
    currentPage,
    data: teamMembers,
  });
  const { meta: roleMeta, paginatedData: paginatedRoleData } =
    paginateData<RoleType>({
      currentPage,
      data: roleData,
    });

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
          label: 'Inactive',
          value: 'inactive',
        },
      ],
      fn: (row: TeamMemberType, value: any) => row.status === value,
    },
  ];

  const tabItems = ['Team members', 'Roles & Permissions'];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-text text-2xl font-medium">Team Management</h3>
          <p className="text-sm text-text-muted ">
            Manage and assign permissions to your team members here
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            className="flex items-center flex-row!"
            variant="outline"
            onClick={() => setCreateRoleModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Create Role
          </Button>
          <Button
            className="flex items-center bg-blue-11a!"
            variant="primary"
            onClick={() => setInviteMemberModal(true)}
          >
            <UserIconLocal className="mr-2" />
            Invite Member
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 justify-between items-center">
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <IconBase className={item.iconClassName}>{item.icon}</IconBase>
            <div className="flex flex-col gap-2">
              <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                {item.title}
              </h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-card relative">
        <div className="relative mb-3 xl:absolute xl:mb-0 top-4 left-4">
          <SlidingTabs
            tabItems={tabItems}
            setActiveIndex={(index: number) => {
              setActiveTab(index);
              setCurrentPage(1);
            }}
            containerClassName="rounded-lg! p-0.5"
            activeIndicatorClassName="rounded-lg! bg-surface-card top-0.5 ml-0.25! mr-0.25 bottom-0.5"
            tabActiveClassName="text-text!"
          />
        </div>
        {activeTab === 0 && (
          <>
            <TeamMembersTable
              data={paginatedData()}
              titleComponent={<></>}
              emptyState={<EmptyTeamsTable />}
              searchable={true}
              searchPlaceholder="Search by name, email, specialization, or qualification..."
              searchContainerClassName="max-w-[404px]!"
              filters={filters}
            ></TeamMembersTable>

            {meta && meta?.pageCount > 1 && (
              <div className="mt-auto pt-10 pb-5">
                <Pagination
                  pages={meta.pageCount}
                  page={currentPage}
                  setPage={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
        {activeTab === 1 && (
          <>
            <RolesTable
              data={paginatedRoleData()}
              titleComponent={<></>}
              emptyState={<EmptyTeamsTable />}
              searchable={true}
              searchPlaceholder="Search by name, email, specialization, or qualification..."
              searchContainerClassName="max-w-[404px]!"
            ></RolesTable>

            {roleMeta && roleMeta?.pageCount > 1 && (
              <div className="mt-auto pt-10 pb-5">
                <Pagination
                  pages={roleMeta.pageCount}
                  page={currentPage}
                  setPage={setCurrentPage}
                />
              </div>
            )}
          </>
        )}

        <CreateRoleModal
          openModal={createRoleModal}
          setOpenModal={setCreateRoleModal}
        ></CreateRoleModal>
        <InviteMemberModal
          openModal={inviteMemberModal}
          setOpenModal={setInviteMemberModal}
        ></InviteMemberModal>
      </div>
    </div>
  );
};

export default TeamManagement;

const getStatus = (): string => {
  const rand = Math.random();

  if (rand < 0.8) return 'active';
  return 'inactive';
};

const getRole = (): string => {
  const rand = Math.random();

  if (rand < 0.2) return 'Operations Manager';
  if (rand < 0.6) return 'Hospital Admin';
  return 'Finance Manager';
};

const teamMembers: TeamMemberType[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: 'john Smith',
  email: 'john.smith@medical.com',
  role: getRole(),
  lastActive: 'in about 14 hours',
  status: getStatus(),
}));

const roleData: RoleType[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: getRole(),
  creatorName: 'Tunde Bakare',
  creatorEmail: 'tunde.bakare@medical.com',
  createdAt: '17/05/2026',
  status: getStatus(),
}));
