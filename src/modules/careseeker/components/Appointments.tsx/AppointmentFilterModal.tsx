'use client';

import type { AppointmentListType, AppointmentStatus } from '@/apiQuery/healthcareAppointments/get/getAppointments';
import Button from '@/components/Ui/Button';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { useState } from 'react';

const LIST_TYPE_OPTIONS = [
  { value: 'provider', label: 'Provider' },
  { value: 'client', label: 'Client' },
];

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'PAID', label: 'Paid' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

const AppointmentFilterModal = ({
  open,
  onClose,
  onApply,
  initialType,
  initialStatus,
}: {
  open: boolean;
  onClose: () => void;
  onApply: (filters: { type?: AppointmentListType; status?: AppointmentStatus }) => void;
  initialType?: AppointmentListType;
  initialStatus?: AppointmentStatus;
}) => {
  const [type, setType] = useState<string>(initialType ?? '');
  const [status, setStatus] = useState<string>(initialStatus ?? '');

  const handleApply = () => {
    onApply({
      type: (type as AppointmentListType) || undefined,
      status: (status as AppointmentStatus) || undefined,
    });
    onClose();
  };

  const handleClear = () => {
    setType('');
    setStatus('');
  };

  return (
    <Modal open={open} onClose={onClose} size="sm" title="Filter Appointments">
      <div className="flex flex-col gap-5">
        <Dropdown
          label="Appointment Type"
          placeholder="Select type"
          options={LIST_TYPE_OPTIONS}
          value={type}
          onChange={(val) => setType(val as string)}
        />
        <Dropdown
          label="Status"
          placeholder="Select status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(val) => setStatus(val as string)}
        />
      </div>

      <div className="flex items-center gap-3 mt-8">
        <Button variant="outline" className="flex-1" onClick={handleClear}>
          Clear
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Apply Filter
        </Button>
      </div>
    </Modal>
  );
};

export default AppointmentFilterModal;
