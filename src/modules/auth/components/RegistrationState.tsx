'use client';

import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { CheckEmailIcon, InfoInvertedIconLocal } from '@/icons/DashboardIcons';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const AccountCreatedInfo = () => {
  const { push } = useRouter();
  return (
    <Card onCancel={() => push('/auth/signin')}>
      <div>
        <span className="w-16 h-16 flex items-center justify-center bg-green-3a rounded-full">
          <CircleCheck className="text-success" />
        </span>

        <h2 className="text-2xl mt-8 text-text font-medium">Account created</h2>
        <p className="text-sm text-text-alt">
          Your account has been successfully created. Pending approval from our
          end. Expect feedback within 3 working days
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => push('/auth/signin')}
          >
            Close
          </Button>
          <Button
            className="w-full"
            variant="primary"
            onClick={() => push('/auth/signin')}
          >
            Okay
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const AccountReviewProgressInfo = () => {
  const { push } = useRouter();
  return (
    <Card onCancel={() => push('/auth/signin')}>
      <div>
        <span className="w-16 h-16 flex items-center justify-center bg-gray-3a rounded-full">
          <InfoInvertedIconLocal className="text-text-alt" />
        </span>

        <h2 className="text-2xl mt-8 text-text font-medium">
          Account review in progress
        </h2>
        <p className="text-sm text-text-alt">
          Your account is currently being reviewed by our team. We will notify
          you once the review is complete.
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => push('/auth/signin')}
          >
            Close
          </Button>
          <Button
            className="w-full"
            variant="primary"
            onClick={() => push('/auth/signin')}
          >
            Okay
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const CheckEmailInfo = ({
  title,
  description,
  action,
  btnText,
}: {
  title: string;
  description: string;
  action?: () => void;
  btnText?: string;
}) => {
  const { back } = useRouter();
  return (
    <Card onCancel={() => back()}>
      <div className="flex flex-col items-center">
        <span className="w-17 h-17 flex items-center justify-center bg-blue-2a rounded-full">
          <CheckEmailIcon className="text-text-alt" />
        </span>

        <h2 className="text-lg mt-6 text-text font-semibold">{title}</h2>
        <p className="mt-3 text-sm text-text-alt text-center max-w-75.75 mx-auto">
          {description}
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button className="w-full" variant="primary" onClick={action}>
            {btnText || 'Continue'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export const PasswordUpdatedInfo = () => {
  const { push } = useRouter();
  return (
    <Card onCancel={() => push('/auth/signin')}>
      <div className="flex flex-col items-center">
        <span className="w-17 h-17 flex items-center justify-center bg-blue-2a rounded-full">
          <CircleCheck size={29} className="text-blue-10" />
        </span>

        <h2 className="text-lg mt-6 text-text font-semibold">
          Password updated
        </h2>
        <p className="mt-3 text-sm text-text-alt text-center max-w-75.75 mx-auto">
          You’ve successfully reset your password. Click continue to go to
          dashboard.
        </p>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full"
            variant="primary"
            onClick={() => push('/auth/signin')}
          >
            Login
          </Button>
        </div>
      </div>
    </Card>
  );
};
