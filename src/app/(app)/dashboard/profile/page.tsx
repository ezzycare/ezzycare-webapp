'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import CareSeekerSettings from '@/modules/careseeker/Settings';
import DoctorProfileSettings from '@/modules/doctor/Profile';
import HospitalSettings from '@/modules/hospital/components/Settings';
import { JSX } from 'react';

const ProfilePage = () => {
  const { accountType } = useGetAccountType();

  const profile: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Settings</div>,
    HOSPITAL: <HospitalSettings />,
    AGENT: <div>Settings</div>,
    DOCTOR: <DoctorProfileSettings />,
    SEEKER: <CareSeekerSettings />,
  };
  return <>{profile[accountType]}</>;
};

export default ProfilePage;
