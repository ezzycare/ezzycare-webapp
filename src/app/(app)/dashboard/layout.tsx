'use client';

import { useGetProfile } from '@/apiQuery/users/getProfile';
import SideNav from '@/components/Dashboard/SideNav';
import TopNav from '@/components/Dashboard/TopNav';
import { useTrackPreviousRoute } from '@/hooks/useTrackPreviousRoute';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import React, { useEffect, useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const updateUser = useAuthStore((state: AuthStore) => state.updateUser);
  const { user } = useGetProfile();

  useEffect(() => {
    if (user) {
      console.log({ user });
      updateUser(user);
    }
  }, [user]);

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
