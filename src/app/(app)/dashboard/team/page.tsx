'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import HospitalTeamDashboard from '@/modules/hospital/components/Team/HospitalTeamDashboard';
import { JSX } from 'react';

const TeamPage = () => {
  const { accountType } = useGetAccountType();

  const team: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Admin</div>,
    HOSPITAL: <HospitalTeamDashboard />,
    AGENT: <div>Agent</div>,
    DOCTOR: <div></div>,
    SEEKER: <div></div>,
  };
  return <>{team[accountType]}</>;
};

export default TeamPage;
