import Dropdown from '@/components/Ui/Dropdown';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { tempRoles } from '@/utils/helper';
import React from 'react';

const InviteMemberModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Invite Team Member"
        description="Send an invitation to join your hospital team"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col">
          <div className="space-y-2 mt-5 w-full flex flex-col">
            <TextInput placeholder="Enter full name" label="Full Name" />
            <TextInput placeholder="Enter email" label="Email" />
            <Dropdown
              label="Color"
              options={tempRoles.map((val) => ({
                value: val,
                label: val,
              }))}
              fullWidth
              containerClassName="h-12!"
            />
          </div>

          <div className="flex w-full gap-2 items-center mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Send Invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InviteMemberModal;
