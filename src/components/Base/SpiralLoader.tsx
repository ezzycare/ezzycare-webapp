'use client';

import { cn } from '@/lib/utils';

interface SpiralLoaderProps {
  size?: number;
  className?: string;
  /** Show a soft ambient glow behind the loader */
  glow?: boolean;
  /** Accessible label for screen readers */
  label?: string;
}

export default function SpiralLoader({
  size = 48,
  className,
  glow = true,
  label = 'Loading',
}: SpiralLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className={cn('relative inline-flex shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {/* Ambient glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-[pulse-soft_2.4s_ease-in-out_infinite]"
          aria-hidden
        />
      )}

      {/* Outer track — soft tinted ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-blue-3a"
        aria-hidden
      />

      {/* Outer arc — clockwise */}
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-[spin_1.4s_cubic-bezier(0.65,0,0.35,1)_infinite]"
        aria-hidden
      />

      {/* Middle ring — counter-clockwise, slightly inset */}
      <div
        className="absolute rounded-full border-2 border-transparent border-t-primary/70 border-r-primary/30"
        style={{
          inset: '18%',
          animation:
            'spin 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite reverse',
        }}
        aria-hidden
      />

      {/* Inner dot — gently pulsing */}
      <div
        className="absolute left-1/2 top-1/2 rounded-full bg-primary animate-[pulse-dot_1.6s_ease-in-out_infinite]"
        style={{
          width: '22%',
          height: '22%',
          transform: 'translate(-50%, -50%)',
          boxShadow:
            '0 0 18px 2px color-mix(in srgb, var(--primary) 60%, transparent)',
        }}
        aria-hidden
      />

      {/* Screen-reader-only loading text */}
      <span className="sr-only">{label}</span>

      <style jsx>{`
        @keyframes pulse-soft {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(0.95);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }
        @keyframes pulse-dot {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.85;
          }
        }
      `}</style>
    </div>
  );
}
