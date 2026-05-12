'use client';

import { cn } from '@/lib/utils';
import { Cross1Icon } from '@radix-ui/react-icons';
import { KeyboardEvent, MouseEvent, ReactNode, useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  containerClassName?: string;
  headerClassName?: string;
  className?: string;
  contentClassName?: string;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  containerClassName = '',
  headerClassName = '',
  className = '',
  contentClassName = '',
}: ModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent | globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) return;

    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className={cn(`
        fixed inset-0 z-50
        flex items-center justify-center
        bg-[#00083046]
        p-4
        animate-in fade-in duration-200
        ${containerClassName}
      `)}
    >
      <div
        ref={panelRef}
        className={`
          relative w-full
          rounded-[14px]
          border border-neutral-3a
          bg-surface-card
          shadow-2xl
          overflow-hidden
          p-8.5
          animate-in zoom-in-95 duration-200
          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div
            className={`flex items-start justify-between gap-4
              mt-3.5 ${headerClassName}`}
          >
            <div className="space-y-1">
              {title && (
                <h2 className="text-2xl text-text font-medium">{title}</h2>
              )}

              {description && (
                <p className="text-sm text-text-muted leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={cn(`
                  absolute top-4 right-4
                  shrink-0
                  w-8 h-8
                  rounded-full
                  flex items-center justify-center
                  hover:border
                  hover:border-primary
                  hover:text-primary
                  cursor-pointer`)}
              >
                <Cross1Icon className="w-4 h-4 text-text" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
