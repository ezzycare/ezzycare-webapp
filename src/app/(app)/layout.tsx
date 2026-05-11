import NavBar from '@/components/Base/Nav';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-full flex-col bg-background">{children}</div>
  );
};

export default AuthLayout;
