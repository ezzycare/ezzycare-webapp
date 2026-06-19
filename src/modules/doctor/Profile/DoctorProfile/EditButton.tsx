/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@heroui/react';
import { Edit } from 'lucide-react';

const EditButton = ({
  title,
  ...props
}: {
  title: string;
  [key: string]: any;
}) => {
  return (
    <Button
      className="rounded-lg! py-1! px-2.5! text-sm text-neutral-11a! bg-neutral-3a! gap-2"
      {...props}
    >
      <Edit size={14} /> {title}
    </Button>
  );
};

export default EditButton;
