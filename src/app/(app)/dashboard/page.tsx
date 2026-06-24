'use client';
import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import AdminDashboard from '@/modules/admin/components/AdminDashboard';
import CareSeekerDashboard from '@/modules/careseeker/components/CareSeekerDashboard';
import DoctorDashboard from '@/modules/doctor/components/DoctorDashboard';
import AgentAdminDashboard from '@/modules/hospital/components/Agent/AgentAdminDashboard';
import HospitalAdminDashboard from '@/modules/hospital/components/HospitalAdminDashboard';
import { JSX } from 'react';

const Dashboard = () => {
  const { accountType } = useGetAccountType();

  const dashboards: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <AdminDashboard />,
    HOSPITAL: <HospitalAdminDashboard />,
    AGENT: <AgentAdminDashboard />,
    DOCTOR: <DoctorDashboard />,
    SEEKER: <CareSeekerDashboard />,
  };

  if (!accountType) {
    return null; // or a loading spinner/skeleton
  }

  return <>{dashboards[accountType]}</>;
};

export default Dashboard;
