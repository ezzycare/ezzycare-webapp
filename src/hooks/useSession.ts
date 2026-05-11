/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';

const useSession = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
        });

        const responseJson = await response.json();
        setSession(responseJson.data);
      } catch (err) {
        console.error(err);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  return { session, loading };
};

export default useSession;
