import Dropdown from '@/components/Ui/Dropdown';
import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { MapPin } from 'lucide-react';
import React from 'react';

const CreateAgentModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDepartment, setSelectedDepartment] = React.useState('');

  const departments = [
    'Nephology',
    'Obstetrics & Gynecology',
    'Ear, Nose & Throat',
    'Ophthalmic',
    'Mental & Psychiatric',
    'Pediatric',
    'Intensive care unit',
    'Orthopedics',
  ];
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Create Agent"
        description="Please provide the agent information"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col">
          <div className="space-y-2 mt-5 flex flex-col">
            <TextInput
              placeholder="E.g Emmanuel Smith"
              label="Full Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
            />
            <TextInput
              placeholder="email@domain.com"
              label="Email"
              leftIcon={<EnvelopeClosedIcon />}
            />
            <PhoneInput placeholder="" label="Phone" />
            <TextInput
              placeholder="Enter address"
              label="Address"
              leftIcon={<MapPin className="text-muted" size={16} />}
            />
            <div>
              <p className="text-sm text-text font-medium mb-1">Department</p>
              <Dropdown
                placeholder="Select Department"
                multiple
                searchable
                fullWidth
                containerClassName="h-14"
                value={selectedDepartment}
                onChange={(v) => setSelectedDepartment(v as string)}
                options={departments.map((dept) => ({
                  label: dept,
                  value: dept,
                }))}
              />
            </div>
          </div>

          <div className="flex w-full mt-6">
            <FancyButton
              variant="primary"
              className="w-full"
              onClick={() => {
                toaster.success('Agent created successfully');
                setOpenModal(false);
              }}
            >
              Create Agent
            </FancyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateAgentModal;
