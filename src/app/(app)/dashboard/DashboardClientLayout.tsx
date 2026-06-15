'use client';

import {
  CategoryType,
  useGetCategoriesQuery,
} from '@/apiQuery/categories/getCategories';
import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import { useGetProfile } from '@/apiQuery/users/getProfile';
import SideNav from '@/components/layout/SideNav';
import TopNav from '@/components/layout/TopNav';
import { useTrackPreviousRoute } from '@/hooks/useTrackPreviousRoute';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import React, { useEffect, useState } from 'react';

const DashboardClientLayout = ({
  children,
  accountType,
  user: serverUser,
}: {
  children: React.ReactNode;
  accountType: ACCOUNT_TYPE;
  user: User | null;
}) => {
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const updateUser = useAuthStore((state: AuthStore) => state.updateUser);
  const setCategories = useCategoryStore(
    (state: CategoryStore) => state.setCategories
  );
  const { user } = useGetProfile();
  const { categories } = useGetCategoriesQuery({
    type: 'HOSPITAL' as CategoryType,
  });

  useEffect(() => {
    if (user) {
      updateUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories]);

  useTrackPreviousRoute();

  return (
    <div className="relative grid grid-cols-1 lg:pl-72.5 bg-background ">
      <SideNav
        sidebarOpen={sidebarOpen}
        setSideBarOpen={setSideBarOpen}
        accountType={accountType}
      />
      <div className="relative pt-20">
        <TopNav
          sidebarOpen={sidebarOpen}
          setSideBarOpen={setSideBarOpen}
          accountType={accountType}
          user={serverUser}
        />
        {children}
      </div>
    </div>
  );
};

export default DashboardClientLayout;
