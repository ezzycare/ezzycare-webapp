import GoogleAuthProvider from '@/providers/GoogleAuthProvider';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <div className="w-full min-h-full flex-col bg-background font-inter">
        {children}
      </div>
    </GoogleAuthProvider>
  );
};

export default AuthLayout;
