'use client';

import { CheckEmailInfo } from '@/modules/auth/components/RegistrationState';
import SelectAuthMode from '@/modules/auth/components/SelectAuthMode';
import Signup from '@/modules/auth/components/Signup';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [state, setState] = useState<string>('select-mode');

  const authEmail = useAuthStore(
    (state: AuthStore) => state.signupDetails.email
  );

  return (
    <>
      {state === 'select-mode' && (
        <SelectAuthMode action={() => setState('signup-details')} />
      )}
      {state === 'signup-details' && (
        <Signup
          type={'SEEKER' as const}
          action={() => setState('check-email')}
        />
      )}
      {state === 'check-email' && (
        <CheckEmailInfo
          title="Check Your Email"
          description=" We have sent a verification link to your email. Click on the link to
          verify your email"
          action={() =>
            router.push(`/auth/verify-email?type=signup&email=${authEmail}`)
          }
        />
      )}
    </>
  );
};

export default Page;
