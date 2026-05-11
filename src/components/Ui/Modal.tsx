'use client';

import { ReactNode, useEffect, useRef, MouseEvent, KeyboardEvent } from 'react';

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

  className?: string;
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

  className = '',
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
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
        p-4
        animate-in fade-in duration-200
      "
    >
      <div
        ref={panelRef}
        className={`
          relative w-full
          rounded-3xl
          border border-neutral-3a
          bg-background
          shadow-2xl
          overflow-hidden
          animate-in zoom-in-95 duration-200

          ${sizeClasses[size]}
          ${className}
        `}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div
            className="
              flex items-start justify-between gap-4
              px-6 py-5
              border-b border-neutral-3a
            "
          >
            <div className="space-y-1">
              {title && (
                <h2 className="text-sm text-text uppercase tracking-wide">
                  {title}
                </h2>
              )}

              {description && (
                <p className="text-sm text-neutral-8a leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="
                  shrink-0
                  w-9 h-9
                  rounded-full
                  border border-neutral-3a
                  flex items-center justify-center
                  text-neutral-8a
                  transition-all
                  hover:border-primary
                  hover:text-primary
                "
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
