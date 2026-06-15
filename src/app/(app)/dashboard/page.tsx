'use client';
import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import AdminDashboard from '@/modules/admin/components/AdminDashboard';
import AgentAdminDashboard from '@/modules/hospital/components/Agent/AgentAdminDashboard';
import PaymentCallback from '@/modules/hospital/components/Agent/BookAppointment/PaymentCallback';
import CareSeekerDashboard from '@/modules/careseeker/components/CareSeekerDashboard';
import HospitalAdminDashboard from '@/modules/hospital/components/HospitalAdminDashboard';
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

  return (
    <>
      {dashboards[accountType]}
      <PaymentCallback />
    </>
  );
};

export default Dashboard;
