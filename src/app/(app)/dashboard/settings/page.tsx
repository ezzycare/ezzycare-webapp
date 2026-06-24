'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import SeekerAccountSettings from '@/modules/careseeker/Settings/SeekerAccountSettings';
import DoctorAccountSettings from '@/modules/doctor/Profile/DoctorAccountSettings';
import HospitalSettings from '@/modules/hospital/components/Settings';
import { JSX } from 'react';

const SettingsPage = () => {
  const { accountType } = useGetAccountType();

  const settings: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Settings</div>,
    HOSPITAL: <HospitalSettings />,
    AGENT: <div>Settings</div>,
    DOCTOR: <DoctorAccountSettings />,
    SEEKER: <SeekerAccountSettings />,
  };
  return <div className="p-7.5 min-h-[90vh]">{settings[accountType]}</div>;
};

export default SettingsPage;
