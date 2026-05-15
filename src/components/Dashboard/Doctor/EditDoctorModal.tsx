import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

const EditDoctorModal = ({
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
        title="Edit Doctor"
        description="Update this Doctor’s record"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col">
          <div className="space-y-2 mt-5 flex flex-col">
            <TextInput placeholder="Enter full name" label="Full Name" />
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
              onClick={() => setOpenModal(false)}
            >
              Save
            </FancyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditDoctorModal;
