'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import CareSeekerSettings from '@/modules/careseeker/Settings';
import HospitalSettings from '@/modules/hospital/components/Settings';
import { JSX } from 'react';

const SettingsPage = () => {
  const { accountType } = useGetAccountType();

  const settings: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Settings</div>,
    HOSPITAL: <HospitalSettings />,
    AGENT: <div>Settings</div>,
    DOCTOR: <div>Settings</div>,
    SEEKER: <CareSeekerSettings />,
  };
  return <>{settings[accountType]}</>;
};

export default SettingsPage;
