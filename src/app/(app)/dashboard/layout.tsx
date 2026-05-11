import SideNav from '@/components/Dashboard/SideNav';
import TopNav from '@/components/Dashboard/TopNav';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid  grid-cols-1 lg:grid-cols-[290px_1fr] bg-background ">
      <SideNav />
      <div>
        <TopNav />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
