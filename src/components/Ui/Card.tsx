'use client';

import { cn } from '@/lib/utils';
import { Cross1Icon } from '@radix-ui/react-icons';

const Card = ({
  children,
  onCancel,
  hideCancelBtn = false,
  className = '',
}: {
  children: React.ReactNode;
  onCancel?: () => void;
  hideCancelBtn?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        `w-full max-w-117 mx-auto bg-surface-card rounded-[14px] px-8.5 py-11.5 relative
        ${className}`
      )}
    >
      {!hideCancelBtn && onCancel && (
        <Cross1Icon
          className="absolute top-7 right-7 w-4 h-4 cursor-pointer"
          onClick={onCancel}
        />
      )}
      {children}
    </div>
  );
};

export default Card;
