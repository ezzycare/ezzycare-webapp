/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AppleSDKContextValue {
  isLoaded: boolean;
  isError: boolean;
}

const AppleSDKContext = createContext<AppleSDKContextValue>({
  isLoaded: false,
  isError: false,
});

export const useAppleSDK = () => useContext(AppleSDKContext);

declare global {
  interface Window {
    AppleID: any;
  }
}

export default function AppleAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'xxx';
  const redirectURI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || 'xxx';

  useEffect(() => {
    if (!clientId) {
      console.error('NEXT_PUBLIC_APPLE_CLIENT_ID is not set');
      return;
    }

    if (window.AppleID) {
      try {
        window.AppleID.auth.init({
          clientId,
          scope: 'name email',
          redirectURI: redirectURI || window.location.origin,
          usePopup: true,
        });
        setIsLoaded(true);
      } catch {
        setIsError(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        window.AppleID.auth.init({
          clientId,
          scope: 'name email',
          redirectURI: redirectURI || window.location.origin,
          usePopup: true,
        });
        setIsLoaded(true);
      } catch {
        setIsError(true);
      }
    };
    script.onerror = () => setIsError(true);

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src*="appleid.auth.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [clientId, redirectURI]);

  return (
    <AppleSDKContext.Provider value={{ isLoaded, isError }}>
      {children}
    </AppleSDKContext.Provider>
  );
}
