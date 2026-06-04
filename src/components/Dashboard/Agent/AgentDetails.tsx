'use client';

import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { ChartSquareIconLocal, HealthIconLocal } from '@/icons/DashboardIcons';
import { StethoscopeIconLocal, UserIconLocal } from '@/icons/DashboardNavIcons';
import { AgentType } from '@/types/agents';
import { ArrowLeft, CircleCheck, Clock4, Edit } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import IconBase from '../IconBase';
import AssignAgentToDoctor from './AssignAgentToDoctor';
import AssignAgentToSpecialty from './AssignAgentToSpecialty';
import EditAgentModal from './EditAgentModal';

const AgentDetails = ({ agent }: { agent: AgentType }) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openAssignDoctorModal, setOpenAssignDoctorModal] =
    React.useState(false);

  const [openAssignSpecialtyModal, setOpenAssignSpecialtyModal] =
    React.useState(false);

  const { accountType } = useGetAccountType();

  const isHospital = useMemo(() => accountType === 'HOSPITAL', [accountType]);
  const isAdmin = useMemo(() => accountType === 'ADMIN', [accountType]);

  const stats = [
    {
      label: 'Total Bookings',
      value: 609,
      icon: <ChartSquareIconLocal className="text-blue-11" />,
      iconClassName: 'bg-blue-3a',
    },
    {
      label: 'Completion Rate',
      value: '89.5%',
      icon: <CircleCheck size={18} className="text-success" />,
      iconClassName: 'bg-green-3a',
    },
    {
      label: 'Follow-up Rate',
      value: '81.9%',
      icon: <HealthIconLocal className="text-purple-11a" />,
      iconClassName: 'bg-purple-3a',
    },
    {
      label: 'Average Response Time',
      value: '16.5 minutes',
      icon: <Clock4 size={18} className="text-blue-11" />,
      iconClassName: 'bg-blue-3a',
    },
  ];
  return (
    <div>
      <Link
        href="/dashboard/agents"
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-text-alt" />
        <p className="text-sm text-text-alt">Back to Agents</p>
      </Link>

      <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-text text-2xl font-medium">Agent Details</h3>
            <StatusText value={agent.status} />
          </div>

          <div className="flex items-center gap-2.5 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <UserIconLocal className="text-primary" />
              <p className="text-sm text-text-alt">AGENT ID: A001</p>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-auto gap-2">
          {isAdmin && (
            <>
              <Button
                variant="outline"
                className="text-text! hover:text-surface-card! py-2! px-4!"
                onClick={() => {}}
              >
                Reject
              </Button>
              <Button variant="primary" className="py-2! px-4!">
                Approve
              </Button>
            </>
          )}
          {isHospital && (
            <Button
              variant="outline"
              className="bg-blue-3a text-primary hover:bg-blue-3a/50 border-none py-2! px-4! gap-2"
              onClick={() => setOpenEditModal(true)}
            >
              Edit Details
              <Edit size={18} className="text-primary" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3 grid grid-cols-1 mt-4 sm:mt-8 items-start">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 justify-between items-center">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex gap-4 items-center justify-left p-4.75 bg-surface-card rounded-lg border border-gray-3"
            >
              <IconBase className={item.iconClassName}>{item.icon}</IconBase>
              <div className="flex flex-col gap-2">
                <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                  {item.label}
                </h2>
                <p className="text-text font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-gray-5 p-5">
          <div className="flex items-center gap-1.5">
            <UserIconLocal className="text-text-alt " />
            <h3 className="text-text text-lg font-medium">
              Agent Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-5 items-center justify-between pb-8">
            <div>
              <h3 className="text-text font-medium">Name</h3>
              <p className="text-sm text-text-muted mt-2.5">{agent.name}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Email</h3>
              <p className="text-sm text-text-muted mt-2.5">{agent.email}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Phone</h3>
              <p className="text-sm text-text-muted mt-2.5">
                {agent.phoneNumber}
              </p>
            </div>
            <div>
              <h3 className="text-text font-medium">Address</h3>
              <p className="text-sm text-text-muted mt-2.5">{agent.address}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-5 p-5">
            <div>
              <div className="flex items-center gap-1.5">
                <StethoscopeIconLocal className="text-text-muted " />
                <h3 className="text-text text-lg font-medium">Assign Doctor</h3>
              </div>
              <p className="text-sm text-text-muted mt-2.5">
                Assign this agent to a specific Doctor
                {/* {'Assigned to yyyyy'} */}
              </p>
            </div>

            <Button
              className="mt-5 gap-3 w-full bg-blue-11a!"
              onClick={() => setOpenAssignDoctorModal(true)}
            >
              <StethoscopeIconLocal />
              Assign Doctor
            </Button>
          </div>
          <div className="rounded-xl border border-gray-5 p-5">
            <div>
              <div className="flex items-center gap-1.5">
                <StethoscopeIconLocal className="text-text-muted " />
                <h3 className="text-text text-lg font-medium">
                  Assign Specialty
                </h3>
              </div>
              <p className="text-sm text-text-muted mt-2.5">
                Assign this agent to a specialty
                {/* {'Assigned to Dr. yyyyy'} */}
              </p>
            </div>

            <Button
              className="mt-5 gap-3 w-full bg-blue-11a!"
              onClick={() => setOpenAssignSpecialtyModal(true)}
            >
              <StethoscopeIconLocal />
              Assign Specialty
            </Button>
          </div>
        </div>
      </div>
      <EditAgentModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />

      <AssignAgentToDoctor
        openModal={openAssignDoctorModal}
        setOpenModal={setOpenAssignDoctorModal}
      />

      <AssignAgentToSpecialty
        openModal={openAssignSpecialtyModal}
        setOpenModal={setOpenAssignSpecialtyModal}
      />
    </div>
  );
};

export default AgentDetails;
