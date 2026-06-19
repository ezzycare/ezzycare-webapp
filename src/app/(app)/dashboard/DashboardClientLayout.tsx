'use client';

import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import {
  CategoryType,
  useGetCategoriesQuery,
} from '@/apiQuery/categories/getCategories';
import { useGetDoctorProfileQuery } from '@/apiQuery/doctor/profile/getProfile';
import { useGetHospitalServices } from '@/apiQuery/hospital/get/getServices';
import { useGetNotificationsInfiniteQuery } from '@/apiQuery/notifications/getNotifications';
import { useGetProfile } from '@/apiQuery/users/getProfile';
import SideNav from '@/components/layout/SideNav';
import TopNav from '@/components/layout/TopNav';
import { useTrackPreviousRoute } from '@/hooks/useTrackPreviousRoute';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import {
  ServicesStore,
  ServicesType,
  useServicesStore,
} from '@/stores/servicesStore';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [sidebarOpen, setSideBarOpen] = useState(false);
  const updateUser = useAuthStore((state: AuthStore) => state.updateUser);
  const updateDoctorUser = useAuthStore(
    (state: AuthStore) => state.updateDoctorUser
  );
  const setCategories = useCategoryStore(
    (state: CategoryStore) => state.setCategories
  );
  const setServices = useServicesStore(
    (state: ServicesStore) => state.setServices
  );
  const setNotifications = useNotificationsStore(
    (state) => state.setNotifications
  );

  const { user } = useGetProfile();
  const { doctorProfile } = useGetDoctorProfileQuery();
  const { categories } = useGetCategoriesQuery({
    type: 'HOSPITAL' as CategoryType,
  });
  const { services } = useGetHospitalServices();
  const { notifications } = useGetNotificationsInfiniteQuery({ limit: 50 });

  useEffect(() => {
    if (doctorProfile) {
      updateUser(doctorProfile as unknown as User);
      updateDoctorUser(doctorProfile);
    }
  }, [doctorProfile]);

  useEffect(() => {
    if (user && !doctorProfile) {
      updateUser(user);
    }
  }, [user, doctorProfile]);

  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }

    if (services) {
      setServices(services as ServicesType[]);
    }

    if (notifications) {
      setNotifications(notifications);
    }
  }, [categories, services, notifications]);

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
