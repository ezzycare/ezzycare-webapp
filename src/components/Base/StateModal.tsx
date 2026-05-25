'use client';

import { Button } from '@/components/Ui/Button';
import Modal, { type ModalProps } from '@/components/Ui/Modal';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import React from 'react';

type StateModalType = 'success' | 'error' | 'warning' | 'info';

type StateModalProps = {
  open: boolean;
  onClose: () => void;
  type?: StateModalType;
  title: string;
  content?: string | React.ReactNode;
  btnText?: string;
  btnAction?: () => void;
  cancelBtnText?: string;
  cancelBtnAction?: () => void;
  loading?: boolean;
  className?: string;
} & Partial<ModalProps>;

const modalConfig: Record<
  StateModalType,
  {
    icon: React.ReactNode;
    iconWrapper: string;
    iconClass: string;
    buttonVariant: string;
  }
> = {
  success: {
    icon: <CheckCircle2 size={30} />,
    iconWrapper: 'bg-green-3a',
    iconClass: 'text-green-11a',
    buttonVariant: 'bg-primary hover:bg-primary/90',
  },

  error: {
    icon: <XCircle size={30} />,
    iconWrapper: 'bg-red-3a',
    iconClass: 'text-red-500',
    buttonVariant: 'bg-primary hover:bg-primary/90',
  },

  warning: {
    icon: <AlertTriangle size={30} />,
    iconWrapper: 'bg-yellow-3a',
    iconClass: 'text-yellow-600',
    buttonVariant: 'bg-primary hover:bg-primary/90',
  },

  info: {
    icon: <Info size={30} />,
    iconWrapper: 'bg-blue-3a',
    iconClass: 'text-primary',
    buttonVariant: 'bg-primary hover:bg-primary/90',
  },
};

const StateModal = ({
  open,
  onClose,
  type = 'info',
  title,
  content,
  btnText = 'Okay',
  btnAction,
  cancelBtnText,
  cancelBtnAction,
  loading = false,
  className,
  ...props
}: StateModalProps) => {
  const config = modalConfig[type];

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      showCloseButton
      className={cn('p-8', className)}
      contentClassName="mt-0"
      {...props}
    >
      <div className="flex flex-col">
        {/* Icon */}
        <span
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            config.iconWrapper
          )}
        >
          <span className={config.iconClass}>{config.icon}</span>
        </span>

        {/* Title */}
        <h2 className="text-2xl mt-8 text-text font-medium">{title}</h2>

        {/* Content */}
        {content && (
          <p className="text-sm text-text-muted mt-1.5 leading-relaxed">
            {content}
          </p>
        )}

        {/* Actions */}
        <div className="mt-10 flex items-center gap-3 w-full">
          {cancelBtnText && (
            <Button
              className="w-full"
              variant="outline"
              onClick={cancelBtnAction || onClose}
            >
              {cancelBtnText}
            </Button>
          )}

          {btnText && (
            <Button
              className={cn('w-full text-white', config.buttonVariant)}
              variant="primary"
              loading={loading}
              onClick={btnAction}
            >
              {btnText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default StateModal;
