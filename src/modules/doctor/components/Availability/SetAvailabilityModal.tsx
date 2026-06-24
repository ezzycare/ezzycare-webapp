'use client';

import Modal from '@/components/Ui/Modal';
import SetAvailability, { type AvailabilityByDay } from './SetAvailability';

export type {
  DayKey,
  ConsultationType,
  Session,
  AvailabilityByDay,
} from './SetAvailability';

interface SetAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  initialAvailability?: AvailabilityByDay;
  onSave?: (availability: AvailabilityByDay) => void;
}

export default function SetAvailabilityModal({
  open,
  onClose,
  initialAvailability,
  onSave,
}: SetAvailabilityModalProps) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Set Availability"
        description="Set your work availability to help us match you with suitable tasks"
        size="md"
        className="max-h-[95vh] overflow-y-auto"
      >
        <SetAvailability
          open={open}
          initialAvailability={initialAvailability}
          onClose={onClose}
          onSave={onSave}
        />
      </Modal>
    </>
  );
}
