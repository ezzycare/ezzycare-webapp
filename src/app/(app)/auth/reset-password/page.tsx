'use client';

import NewPasswordForm from '@/modules/auth/components/NewPasswordForm';
import {
  CheckEmailInfo,
  PasswordUpdatedInfo,
} from '@/modules/auth/components/RegistrationState';
import ResetPasswordEmail from '@/modules/auth/components/ResetPasswordEmail';
import ResetPasswordOtp from '@/modules/auth/components/ResetPasswordOtp';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [state, setState] = useState<string>('reset-form');

  return (
    <>
      {state === 'reset-form' && (
        <ResetPasswordEmail action={() => setState('check-email')} />
      )}
      {state === 'check-email' && (
        <CheckEmailInfo
          title="Password reset link sent!"
          description="A reset link has been sent to your email to reset your password"
          action={() => setState('verify-otp')}
        />
      )}
      {state === 'verify-otp' && (
        <ResetPasswordOtp action={() => setState('new-password')} />
      )}
      {state === 'new-password' && (
        <NewPasswordForm action={() => setState('password-updated')} />
      )}
      {state === 'password-updated' && <PasswordUpdatedInfo />}
    </>
  );
};

export default Page;
