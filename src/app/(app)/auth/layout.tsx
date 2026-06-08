'use client';

import NavBar from '@/components/Base/Nav';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuthenticated = useAuthStore(
    (state: AuthStore) => state.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/dashboard'); // redundant
    }
  });

  return (
    <div>
      <header className="w-full flex pr-2 pl-5 sm:px-5 lg:px-0">
        <NavBar />
      </header>
      <div className="flex justify-center items-center min-h-[90vh] w-full pt-5 sm:pt-7.5 px-3">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
