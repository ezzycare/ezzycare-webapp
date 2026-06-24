'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import SeekerWallet from '@/modules/careseeker/Settings/SeekerWallet';
import DoctorWallet from '@/modules/doctor/Profile/DoctorWallet';
import { JSX } from 'react';

const Page = () => {
  const { accountType } = useGetAccountType();

  const wallet: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Settings</div>,
    HOSPITAL: <></>,
    AGENT: <div>Settings</div>,
    DOCTOR: <DoctorWallet />,
    SEEKER: <SeekerWallet />,
  };

  return <div className="p-7.5">{wallet[accountType]}</div>;
};

export default Page;
