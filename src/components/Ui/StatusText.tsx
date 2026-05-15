import { statusColor, StatusType } from '@/utils/helper';

const StatusText = ({
  value,
  text,
  className = '',
}: {
  value: string;
  text?: string;
  className?: string;
}) => {
  return (
    <p
      className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${statusColor(
        value as StatusType
      )} ${className}`}
    >
      {text || value}
    </p>
  );
};

export default StatusText;
