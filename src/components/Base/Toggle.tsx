'use client';

import { cn } from '@/lib/utils';

type ToggleSize = 'sm' | 'md' | 'lg';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

const sizeStyles: Record<
  ToggleSize,
  {
    container: string;
    ball: string;
    translate: string;
  }
> = {
  sm: {
    container: 'w-9 h-5',
    ball: 'w-3.5 h-3.5',
    translate: 'translate-x-4',
  },
  md: {
    container: 'w-11 h-6',
    ball: 'w-4.5 h-4.5',
    translate: 'translate-x-5',
  },
  lg: {
    container: 'w-14 h-7',
    ball: 'w-5.5 h-5.5',
    translate: 'translate-x-7',
  },
};

const Toggle = ({
  value,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className,
}: ToggleProps) => {
  const styles = sizeStyles[size];

  return (
    <label
      className={cn(
        'inline-flex items-center gap-3',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={value}
        disabled={disabled}
        onClick={() => !disabled && onChange(!value)}
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors duration-200',
          styles.container,
          value ? 'bg-primary' : 'bg-text-muted'
        )}
      >
        <span
          className={cn(
            'absolute left-1 rounded-full bg-white transition-transform duration-200',
            styles.ball,
            value ? styles.translate : 'translate-x-0'
          )}
        />
      </button>

      {label && <span className="text-xs text-text font-medium">{label}</span>}
    </label>
  );
};

export default Toggle;
