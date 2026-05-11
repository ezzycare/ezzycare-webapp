'use client';

// import { redirect } from 'next/navigation';
import Tabs from '@/components/Base/Tabs';
import BaseTable from '@/components/Ui/Table';
import {
  CreditCardIconLocal,
  HospitalIconLocal,
} from '@/icons/DashboardNavIcons';
import PeopleIconLocal from '@/icons/PeopleIcon';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import React from 'react';

type StatusType = 'pending' | 'approved' | 'inactive';
const statusColor = (status: StatusType): string => {
  const statuses = {
    pending: 'bg-warning-2a text-warning-11a',
    approved: 'bg-success/10 text-success',
    inactive: 'bg-red-2a text-red-11a',
  };

  return statuses[status] as string;
};

// const authenticated = false;
const Dashboard = () => {
  // if (!authenticated) redirect('/auth');

  const totals = [
    {
      title: 'Total Care Seekers',
      value: '2500',
      icon: <PeopleIconLocal className="text-blue-10ab" />,
    },
    {
      title: 'Total Hospitals',
      value: '2500',
      icon: <HospitalIconLocal className="text-pink-10" />,
    },
    {
      title: 'Total Doctors',
      value: '1200',
      icon: <PeopleIconLocal className="text-green-10" />,
    },
    {
      title: 'Total Agents',
      value: '2500',
      icon: <PeopleIconLocal className="text-orange-10a" />,
    },
    {
      title: 'Pending Approval',
      value: '1200',
      icon: <PeopleIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Total Revenue',
      value: '10,000,000.00',
      icon: <CreditCardIconLocal className="text-pink-11" />,
    },
  ];

  const pendingRequests = [
    {
      title: 'Doctors Request',
      value: 12,
      icon: <HospitalIconLocal className="text-purple-10" />,
    },
    {
      title: 'Hospitals Request',
      value: 5,
      icon: <HospitalIconLocal className="text-pink-10" />,
    },
    {
      title: 'Agents Request',
      value: 8,
      icon: <PeopleIconLocal className="text-orange-10a" />,
    },
  ];

  type RegistrationType = {
    id: number;
    name: string;
    email: string;
    registeredOn: string;
    status: string;
  };

  const registrations: RegistrationType[] = Array.from(
    { length: 10 },
    (_, i) => ({
      id: i + 1,
      name: 'Blessing Alfred',
      email: 'blealf@gmail.com',
      registeredOn: '2025-03-12',
      status: i % 2 === 0 ? 'pending' : 'approved',
    })
  );

  return (
    <div className="p-7.5">
      <h1 className="text-muted text-[28px] font-medium mb-4">
        Welcome back, <span className="text-text">Admin</span>
      </h1>
      <p>Here&apos;s what is happening on the platform today...</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 justify-between items-center">
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <IconBase>{item.icon}</IconBase>
            <div className="flex flex-col gap-2">
              <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                {item.title}
              </h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6.5">
        <h2 className="text-text font-semibold mb-4.5">
          Pending Approval Requests
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-between items-center">
          {pendingRequests.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
            >
              <IconBase>{item.icon}</IconBase>
              <div className="flex flex-col gap-2">
                <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                  {item.title}
                </h2>
                <p className="text-text font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 px-5.5 py-6.5 rounded-xl bg-surface-card">
        <div className="flex items-center gap-2 mb-4.5">
          <h2 className="text-text font-semibold">New Registrations</h2>
          <div className="bg-blue-2a text-xs text-primary font-medium p-1.5">
            {240}
          </div>
        </div>
        <div>
          <Tabs
            tabItems={['Doctors', 'Hospitals', 'Agents', 'Care Seekers']}
            setActiveIndex={(index) => console.log('Active tab index:', index)}
          />
          <div className="mt-4">
            <BaseTable<RegistrationType>
              data={registrations}
              searchable={false}
              columns={[
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
                  field: 'registeredOn',
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

                  render: () => (
                    <div
                      className={`inline-flex gap-2 rounded-full px-3 py-1 text-xs font-medium border border-border`}
                    >
                      <EyeOpenIcon className="text-gray-500" />
                      <span>View</span>
                    </div>
                  ),
                },
              ]}
            ></BaseTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

const IconBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-13.5 w-13.5 items-center justify-center rounded-lg bg-gray-2">
      {children}
    </div>
  );
};
