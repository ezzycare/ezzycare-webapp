'use client';

import SideNav from '@/components/Dashboard/SideNav';
import TopNav from '@/components/Dashboard/TopNav';
import React, { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  return (
    <div className="grid  grid-cols-1 lg:grid-cols-[290px_1fr] bg-background ">
      <SideNav sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
      <div>
        <TopNav sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
