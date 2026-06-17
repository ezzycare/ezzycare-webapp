import { getSession } from '@/serverActions/getSession';
import { redirect } from 'next/navigation';
import DashboardClientLayout from './DashboardClientLayout';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();
  const accountType = session?.user?.accountType;
  const user = session?.user ?? null;

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <DashboardClientLayout accountType={accountType} user={user}>
      {children}
    </DashboardClientLayout>
  );
};

export default DashboardLayout;
