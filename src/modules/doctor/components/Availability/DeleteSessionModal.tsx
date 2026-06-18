// components/availability/DeleteSessionModal.tsx
'use client';

import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { AlertCircle } from 'lucide-react';

interface DeleteSessionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteSessionModal({
  open,
  onClose,
  onConfirm,
}: DeleteSessionModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" showCloseButton title="">
      <div className="flex flex-col items-center gap-5 text-center">
        <h3 className="text-base font-semibold text-text">Delete session?</h3>

        <div className="w-20 h-20 rounded-full bg-error-3a flex items-center justify-center">
          <AlertCircle className="w-9 h-9 text-error" strokeWidth={1.5} />
        </div>

        <p className="text-sm text-text-muted max-w-xs">
          Are you sure you want to delete the session time?
        </p>

        <div className="flex items-center gap-3 w-full mt-2">
          <Button
            variant="primary"
            className="flex-1 h-11 rounded-full bg-surface-card text-blue-10 border border-blue-10 hover:bg-blue-2"
            onClick={onClose}
          >
            No
          </Button>
          <Button
            variant="primary"
            className="flex-1 h-11 rounded-full"
            onClick={onConfirm}
          >
            Yes, delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
