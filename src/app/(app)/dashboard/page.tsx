'use client';
import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import AdminDashboard from '@/components/Dashboard/Admin/AdminDashboard';
import AgentAdminDashboard from '@/components/Dashboard/Agent/AgentAdminDashboard';
import CareSeekerDashboard from '@/components/Dashboard/CareSeeker/CareSeekerDashboard';
import HospitalAdminDashboard from '@/components/Dashboard/Hospital/HospitalAdminDashboard';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { JSX } from 'react';

const Dashboard = () => {
  const { accountType } = useGetAccountType();

  const dashboards: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <AdminDashboard />,
    HOSPITAL: <HospitalAdminDashboard />,
    AGENT: <AgentAdminDashboard />,
    DOCTOR: <div>Doctor Dashboard</div>,
    SEEKER: <CareSeekerDashboard />,
  };

  if (!accountType) {
    return null; // or a loading spinner/skeleton
  }

  return <>{dashboards['SEEKER']}</>;
  // return <>{dashboards[accountType]}</>;
};

export default Dashboard;
