import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import TextArea from '@/components/Ui/TextArea';
import React from 'react';

const CancelBookingModal = ({
  openModal,
  setOpenModal,
  isLoading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  action: (value: string) => void;
}) => {
  const [reason, setReason] = React.useState('');
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Cancel Appointment"
        description="Please state reason including any symptoms"
        size="md"
        persistent
      >
        <div className="space-y-3">
          <div className="w-full mt-5">
            <p className="text-base text-text font-semibold">Reason</p>
            <TextArea
              value={reason}
              placeholder="Please state reason including any symptoms"
              className="mt-2 min-h-38.25!"
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </div>

          <Button
            variant="primary"
            className="py-2.5! w-full"
            disabled={!reason.length || isLoading}
            loading={isLoading}
            onClick={() => {
              action(reason);
            }}
          >
            Cancel Appointment
          </Button>
          <Button
            variant="outline"
            className="py-2.5! w-full"
            disabled={isLoading}
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Go back
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default CancelBookingModal;
