import AdminDashboard from '@/components/Dashboard/Admin/AdminDashboard';
import HospitalAdminDashboard from '@/components/Dashboard/Hospital/HospitalAdminDashboard';

type Role = 'admin' | 'hospital';
const user: { role: Role } = {
  role: 'hospital',
};

const Dashboard = () => {
  const dashboard = {
    admin: <AdminDashboard />,
    hospital: <HospitalAdminDashboard />,
  };

  return (
    <div>
      {user.role === 'admin' && dashboard.admin}
      {user.role === 'hospital' && dashboard.hospital}
    </div>
  );
};

export default Dashboard;
