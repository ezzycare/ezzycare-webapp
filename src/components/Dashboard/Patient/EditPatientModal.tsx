import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

const EditPatientModal = ({
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
        title="Edit Patient"
        description="Update this patient record"
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
          </div>

          <div className="flex w-full mt-6">
            <FancyButton
              variant="primary"
              className="w-full"
              onClick={() => {
                toaster.success('Patient Updated successfully');
                setOpenModal(false);
              }}
            >
              Save
            </FancyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditPatientModal;
