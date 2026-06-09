'use client';

import SelectAuthMode from '@/components/Auth/SelectAuthMode';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [state, setState] = useState<string>('select-mode');

  return (
    <>
      <SelectAuthMode action={() => setState('signup-details')} />
    </>
  );
};

export default Page;
