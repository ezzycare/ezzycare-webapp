'use client';

import { InfoInvertedIconLocal } from '@/icons/DashboardIcons';
import { CircleCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Card from '../Ui/Card';
import Button from '../Ui/Button';

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
