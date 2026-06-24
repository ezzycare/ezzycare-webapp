'use client';

import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import TextArea from '@/components/Ui/TextArea';
import { TextInput } from '@/components/Ui/TextInput';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

export const consultationNotesSchema = z.object({
  diagnostic: z.string().min(1, 'Diagnostic is required'),
  symptomsObserved: z.string().min(1, 'Symptoms observed is required'),
  prescription: z.string().min(1, 'Prescription is required'),
  followUpInstructions: z.string().optional(),
});

export type ConsultationNotesFormData = z.infer<typeof consultationNotesSchema>;

interface PostConsultationNotesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ConsultationNotesFormData) => void;
  isLoading?: boolean;
}

export const PostConsultationNotesModal = ({
  open,
  onClose,
  onSubmit,
  isLoading,
}: PostConsultationNotesModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationNotesFormData>({
    resolver: zodResolver(consultationNotesSchema),
    defaultValues: {
      diagnostic: '',
      symptomsObserved: '',
      prescription: '',
      followUpInstructions: '',
    },
  });

  const handleFormSubmit = (data: ConsultationNotesFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      showCloseButton={false}
      size="lg"
      persistent
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="text-left">
          <h2 className="text-2xl text-text font-medium">
            Post-Consultation Notes
          </h2>
          <p className="text-sm text-text-alt mt-2">
            Document the session details before completing the appointment.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-text">
              Diagnostic <span className="text-error">*</span>
            </label>
            <TextInput
              {...register('diagnostic')}
              placeholder="Enter diagnostic findings"
              error={errors.diagnostic?.message}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text">
              Symptoms Observed <span className="text-error">*</span>
            </label>
            <TextArea
              {...register('symptomsObserved')}
              placeholder="Enter observed symptoms"
              error={errors.symptomsObserved?.message}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text">
              Prescription <span className="text-error">*</span>
            </label>
            <TextArea
              {...register('prescription')}
              placeholder="Enter prescription details"
              error={errors.prescription?.message}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-text">
              Follow-up Instructions
            </label>
            <TextArea
              {...register('followUpInstructions')}
              placeholder="Enter any follow-up instructions (optional)"
              error={errors.followUpInstructions?.message}
              rows={2}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            className="w-full bg-blue-11!"
            variant="primary"
            loading={isLoading}
            type="submit"
          >
            {isLoading ? 'Submitting...' : 'Submit & Complete'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
