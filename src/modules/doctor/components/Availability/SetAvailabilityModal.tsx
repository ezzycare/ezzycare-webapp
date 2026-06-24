'use client';

import Modal from '@/components/Ui/Modal';
import SetAvailability from './SetAvailability';

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ConsultationType = 'video' | 'home' | 'clinic';

export interface Session {
  id: string;
  consultationType: ConsultationType;
  startTime: string;
  endTime: string;
}

export type AvailabilityByDay = Record<DayKey, Session[]>;

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const CONSULTATION_LABELS: Record<ConsultationType, string> = {
  video: 'Video consultation',
  home: 'Home consultation',
  clinic: 'Clinic consultation',
};

interface SetAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  initialAvailability?: AvailabilityByDay;
  onSave?: (availability: AvailabilityByDay) => void;
}

const emptyAvailability: AvailabilityByDay = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function SetAvailabilityModal({
  open,
  onClose,
  initialAvailability = emptyAvailability,
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
          initialAvailability={initialAvailability}
          onClose={onClose}
          onSave={onSave}
        />
      </Modal>
    </>
  );
}
