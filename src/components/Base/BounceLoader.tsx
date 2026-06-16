'use client';

import { cn } from '@/lib/utils';

interface BounceLoaderProps {
  className?: string;
  dotClassName?: string;
  /** Tailwind opacity class for the backdrop, e.g. 'bg-surface-card/60'. Defaults to white at 60%. */
  backdropClassName?: string;
}

export default function BounceLoader({
  className,
  dotClassName,
  backdropClassName = 'bg-surface-card/60',
}: BounceLoaderProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[1px]',
        backdropClassName,
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full bg-blue-10 animate-bounce',
            '[animation-delay:-0.3s]',
            dotClassName
          )}
        />
        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full bg-blue-10 animate-bounce',
            '[animation-delay:-0.15s]',
            dotClassName
          )}
        />
        <span
          className={cn(
            'w-2.5 h-2.5 rounded-full bg-blue-10 animate-bounce',
            dotClassName
          )}
        />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
