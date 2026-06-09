'use client';

import CareSeekerSignup from '@/components/Auth/CareSeekerSignup';
import { CheckEmailInfo } from '@/components/Auth/RegistrationState';
import SelectAuthMode from '@/components/Auth/SelectAuthMode';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [state, setState] = useState<string>('select-mode');

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
          action={() => router.push('/auth/signup/verify-email?type=signup')}
        />
      )}
    </>
  );
};

export default Page;
