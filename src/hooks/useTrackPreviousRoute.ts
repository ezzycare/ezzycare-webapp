'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useTrackPreviousRoute() {
  const pathname = usePathname();

  useEffect(() => {
    const current = sessionStorage.getItem('currentRoute');

    if (current) {
      sessionStorage.setItem('previousRoute', current);
    }

    sessionStorage.setItem('currentRoute', pathname);
  }, [pathname]);
}
