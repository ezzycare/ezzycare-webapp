import StateModal from '@/components/Base/StateModal';
import Dropdown from '@/components/Ui/Dropdown';
import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

const InviteDoctorModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
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
        title="Invite Doctor"
        description="Provide doctor’s information"
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
            <Dropdown
              label="Assign Department"
              options={departments.map((val) => ({
                value: val,
                label: val,
              }))}
              fullWidth
              mainClassName="h-12!"
            />
          </div>

          <div className="flex w-full mt-6">
            <FancyButton
              variant="primary"
              className="w-full"
              onClick={() => {
                setShowSuccessModal(true);
                setOpenModal(false);
              }}
            >
              Invite Doctor
            </FancyButton>
          </div>
        </div>
      </Modal>
      <StateModal
        open={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type="success"
        title="Invitation sent!"
        content={
          <span>
            We&apos;ve sent an email with an invitation link to{' '}
            <span className="font-bold">sarah.johnson@medical.com</span>. They
            will come onboard when they accept the invite.
          </span>
        }
        btnText="Okay"
        btnAction={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default InviteDoctorModal;
