import { cn } from '@/lib/utils';

const IconBase = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `flex h-13.5 w-13.5 items-center justify-center rounded-lg bg-gray-2 ${className}`
      )}
    >
      {children}
    </div>
  );
};

export default IconBase;
