'use client';

import CareSeekerSignup from '@/components/Auth/CareSeekerSignup';
import { CheckEmailInfo } from '@/components/Auth/RegistrationState';
import SelectAuthMode from '@/components/Auth/SelectAuthMode';
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
        <CareSeekerSignup action={() => setState('check-email')} />
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
