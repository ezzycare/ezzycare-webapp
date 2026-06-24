import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import GoogleAuthProvider from '@/providers/GoogleAuthProvider';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleAuthProvider>
      <ChatSocketProvider>
        <div className="w-full min-h-full flex-col bg-background font-inter">
          {children}
        </div>
      </ChatSocketProvider>
    </GoogleAuthProvider>
  );
};

export default AuthLayout;
