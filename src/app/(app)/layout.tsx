import AppleAuthProvider from '@/providers/AppleAuthProvider';
import FacebookAuthProvider from '@/providers/FacebookAuthProvider';
import GoogleAuthProvider from '@/providers/GoogleAuthProvider';
import React from 'react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <FacebookAuthProvider>
        <AppleAuthProvider>
          <div className="w-full min-h-full flex-col bg-background font-inter">
            {children}
          </div>
        </AppleAuthProvider>
      </FacebookAuthProvider>
    </GoogleAuthProvider>
  );
};

export default AppLayout;
