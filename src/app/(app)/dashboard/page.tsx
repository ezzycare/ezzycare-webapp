import AdminDashboard from '@/components/Dashboard/Admin/AdminDashboard';
import AgentAdminDashboard from '@/components/Dashboard/Agent/AgentAdminDashboard';
import HospitalAdminDashboard from '@/components/Dashboard/Hospital/HospitalAdminDashboard';

type Role = 'admin' | 'hospital' | 'agent';

interface DashboardProps {
  searchParams: Promise<{
    role?: Role;
  }>;
}

const Dashboard = async ({ searchParams }: DashboardProps) => {
  const params = await searchParams;

  const role: Role = params.role ?? 'hospital';

  const dashboard = {
    admin: <AdminDashboard />,
    hospital: <HospitalAdminDashboard />,
    agent: <AgentAdminDashboard />,
  };

  return <div>{dashboard[role]}</div>;
};

export default Dashboard;
