'use client';

import Button from '@/components/Ui/Button';
import TextArea from '@/components/Ui/TextArea';
import Modal from '@/components/Ui/Modal';
import { useState } from 'react';

const DeclineAppointmentModal = ({
  open,
  onClose,
  isLoading,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  onSubmit: (reason: string) => void;
}) => {
  const [reason, setReason] = useState('');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Decline Appointment"
      description="Please provide a reason for declining"
      size="md"
      persistent
    >
      <div className="space-y-3">
        <div className="w-full mt-5">
          <p className="text-base text-text font-semibold">Reason</p>
          <TextArea
            value={reason}
            placeholder="Please state reason for declining"
            className="mt-2 min-h-38.25!"
            onChange={(e) => {
              setReason(e.target.value);
            }}
          />
        </div>

        <Button
          variant="primary"
          className="py-2.5! w-full"
          disabled={!reason.trim().length || isLoading}
          loading={isLoading}
          onClick={() => {
            onSubmit(reason);
          }}
        >
          Decline Appointment
        </Button>
        <Button
          variant="outline"
          className="py-2.5! w-full"
          disabled={isLoading}
          onClick={onClose}
        >
          Go back
        </Button>
      </div>
    </Modal>
  );
};

export default DeclineAppointmentModal;
