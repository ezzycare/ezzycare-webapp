import StateModal from '@/components/Base/StateModal';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

const CreateDoctorModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Create Doctor"
        description="Create the Doctor’s record"
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
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                setShowSuccessModal(true);
                setOpenModal(false);
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
      <StateModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Doctor Added"
        content={
          <span>
            We have sent login credentials to{' '}
            <span className="font-bold">sarah.johnson@medical.com</span> they
            will continue the onboarding process from their end.
          </span>
        }
        btnText="Okay"
        btnAction={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default CreateDoctorModal;
