'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'xxx';
export default function GoogleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
