'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface FacebookSDKContextValue {
  isLoaded: boolean;
  isError: boolean;
}

const FacebookSDKContext = createContext<FacebookSDKContextValue>({
  isLoaded: false,
  isError: false,
});

export const useFacebookSDK = () => useContext(FacebookSDKContext);

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FB: any;
    fbAsyncInit?: () => void;
  }
}

export default function FacebookAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(() => {
    if (typeof window !== 'undefined' && window.FB) return true;
    return false;
  });
  const [isError, setIsError] = useState(false);
  const scriptAppendedRef = useRef(false);
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || 'xxx';

  useEffect(() => {
    if (!appId || scriptAppendedRef.current) return;

    if (window.FB) return;

    scriptAppendedRef.current = true;

    window.fbAsyncInit = () => {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v22.0',
      });

      window.FB.AppEvents.logPageView();
      setIsLoaded(true);
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onerror = () => setIsError(true);

    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://connect.facebook.net/en_US/sdk.js"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
      delete window.fbAsyncInit;
    };
  }, [appId]);

  return (
    <FacebookSDKContext.Provider value={{ isLoaded, isError }}>
      {children}
    </FacebookSDKContext.Provider>
  );
}
