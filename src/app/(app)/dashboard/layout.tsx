'use client';

import SideNav from '@/components/Dashboard/SideNav';
import TopNav from '@/components/Dashboard/TopNav';
import { useTrackPreviousRoute } from '@/hooks/useTrackPreviousRoute';
import React, { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSideBarOpen] = useState(false);

  useTrackPreviousRoute();

  return (
    <div className="relative grid grid-cols-1 lg:pl-72.5 bg-background ">
      <SideNav sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
      <div className="relative pt-20">
        <TopNav sidebarOpen={sidebarOpen} setSideBarOpen={setSideBarOpen} />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
