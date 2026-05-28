import NavBar from '@/components/Base/Nav';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="w-full flex pr-2 pl-5 sm:px-5 lg:px-0">
        <NavBar />
      </header>
      <div className="flex justify-center items-center min-h-[90vh] w-full pt-5 sm:pt-7.5">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
