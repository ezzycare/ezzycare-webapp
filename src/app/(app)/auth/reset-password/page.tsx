'use client';

import NewPasswordForm from '@/modules/auth/components/NewPasswordForm';
import {
  CheckEmailInfo,
  PasswordUpdatedInfo,
} from '@/modules/auth/components/RegistrationState';
import ResetPasswordEmail from '@/modules/auth/components/ResetPasswordEmail';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  // const [state, setState] = useState<string>('reset-form');
  const [state, setState] = useState<string>('password-updated');

  return (
    <>
      {state === 'reset-form' && (
        <ResetPasswordEmail action={() => setState('check-email')} />
      )}
      {state === 'check-email' && (
        <CheckEmailInfo
          title="Password reset link sent!"
          description="A reset link has been sent to your email to reset your password"
          action={() => setState('new-password')}
        />
      )}
      {state === 'new-password' && (
        <NewPasswordForm action={() => setState('password-updated')} />
      )}
      {state === 'password-updated' && <PasswordUpdatedInfo />}
    </>
  );
};

export default Page;
