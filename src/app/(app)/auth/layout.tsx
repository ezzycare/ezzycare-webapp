import NavBar from '@/components/Base/Nav';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="w-full flex pr-2 pl-5 sm:px-5 lg:px-0">
        <NavBar />
      </header>
      {children}
    </div>
  );
};

export default AuthLayout;
