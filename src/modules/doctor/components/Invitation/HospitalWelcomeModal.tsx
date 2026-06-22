'use client';

import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { InvitationIconLocal } from '@/icons/DashboardIcons';
import { useAuthStore } from '@/stores/authStore';

interface HospitalWelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const HospitalWelcomeModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: HospitalWelcomeModalProps) => {
  const doctorUser = useAuthStore((state) => state.doctorUser);
  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={true}
      size="md"
      persistent
    >
      <div className="text-center">
        <span className="w-16 h-16 inline-flex items-center justify-center ">
          <InvitationIconLocal size={74} />
        </span>

        <h2 className="text-lg mt-8 text-text font-semibold">
          Welcome Onboard, Dr. {`${doctorUser.firstName}!`}
        </h2>
        <p className="text-sm text-text-muted mt-2 text-center max-w-90.5 mx-auto">
          {`You've received an invitation to join Emory Specialist Hospital 
            as an in-house doctor. Click below to complete your profile 
            and get verified.`}
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="primary"
            onClick={onConfirm}
            loading={isLoading}
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
};
