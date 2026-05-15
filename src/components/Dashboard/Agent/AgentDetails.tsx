'use client';

import { Button } from '@/components/Ui/Button';
import FancyButton from '@/components/Ui/FancyButton';
import StatusText from '@/components/Ui/StatusText';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { AgentType } from '@/types/agents';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import EditAgentModal from './EditAgentModal';

const AgentDetails = ({ agent }: { agent: AgentType }) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
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
          <FancyButton
            variant="outline"
            className="text-text! hover:text-surface-card! py-2! px-4!"
            onClick={() => {}}
          >
            Reject
          </FancyButton>
          <FancyButton variant="primary" className="py-2! px-4!">
            Approve
          </FancyButton>
          <Button
            variant="outline"
            className="bg-blue-3a text-primary hover:bg-blue-3a/50 border-none py-2! px-4! gap-2"
            onClick={() => setOpenEditModal(true)}
          >
            Edit Details
            <Edit size={18} className="text-primary" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 mt-4 sm:mt-8 items-start">
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
      </div>
      <EditAgentModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
    </div>
  );
};

export default AgentDetails;
