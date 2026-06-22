'use client';

import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { InfoInvertedIconLocal } from '@/icons/DashboardIcons';

interface EndConsultationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const EndConsultationModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: EndConsultationModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      showCloseButton={false}
      size="sm"
      persistent
    >
      <div className="text-center">
        <span className="w-16 h-16 inline-flex items-center justify-center bg-error-3a rounded-full">
          <InfoInvertedIconLocal className="text-error" />
        </span>

        <h2 className="text-2xl mt-8 text-text font-medium">End session?</h2>
        <p className="text-sm text-text-alt mt-2">
          {`Are you sure you want to end this consultation? You'll be taken to the
          notes screen to document the session.`}
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            className="w-full bg-error!"
            variant="primary"
            onClick={onConfirm}
            loading={isLoading}
          >
            {isLoading ? 'Ending...' : 'Yes, End Session'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
