'use client';

import { useCompleteDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/completeAppointment';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { toaster } from '@/lib/toaster';
import { useQueryClient } from '@tanstack/react-query';
import { Info } from 'lucide-react';

interface EndConsultationModalProps {
  open: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointmentId?: number;
}

export const EndConsultationModal = ({
  open,
  isLoading = false,
  onClose,
  onConfirm,
  appointmentId,
}: EndConsultationModalProps) => {
  const queryClient = useQueryClient();
  const { mutate: completeAppointment, isPending } =
    useCompleteDoctorAppointmentMutation();

  const handleConfirm = () => {
    if (!appointmentId) {
      onConfirm();
      return;
    }
    completeAppointment(
      { id: String(appointmentId) },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['doctor', 'appointments'],
          });
          onConfirm();
        },
        onError: () => {
          toaster.error('Failed to end consultation');
        },
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose} size="md" persistent>
      <div className="text-center">
        <span className="w-18.5 h-18.5 inline-flex items-center justify-center bg-error-3a rounded-full">
          <Info size={32} className="text-error rotate-180" />
        </span>

        <h2 className="text-lg mt-6 text-text font-semi-bold">End session?</h2>
        <p className="text-sm text-text-muted mt-2 max-w-87.5 mx-auto">
          {`Are you sure you want to end this consultation? You'll be taken to the
          notes screen to document the session.`}
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full h-10! text-sm"
            variant="secondary"
            onClick={onClose}
            disabled={isPending || isLoading}
            loading={isPending || isLoading}
          >
            Close
          </Button>
          <Button
            className="w-full bg-error! h-10! text-sm"
            variant="primary"
            onClick={handleConfirm}
            disabled={isPending || isLoading}
            loading={isPending || isLoading}
          >
            {isPending ? 'Ending...' : 'Yes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
