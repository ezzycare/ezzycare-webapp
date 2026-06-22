import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { InfoInvertedIconLocal } from '@/icons/DashboardIcons';

interface StartConsultationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const StartConsultationModal = ({
  open,
  onClose,
  onConfirm,
  isLoading,
}: StartConsultationModalProps) => {
  return (
    <Modal open={open} onClose={onClose} showCloseButton={false} size="sm">
      <div className="text-center">
        <span className="w-16 h-16 inline-flex items-center justify-center bg-info-3a rounded-full">
          <InfoInvertedIconLocal className="text-info" />
        </span>

        <h2 className="text-2xl mt-8 text-text font-medium">
          Start consultation?
        </h2>
        <p className="text-sm text-text-alt mt-2">
          Have you informed the care seeker? This is important that the care
          seeker is also ready for the consultation.
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
            className="w-full bg-blue-11!"
            variant="primary"
            onClick={onConfirm}
            loading={isLoading}
          >
            {isLoading ? 'Starting...' : 'Yes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
