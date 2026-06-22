'use client';

import { useThemeStore } from '@/stores/themeStore';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LANDING_ROOTS = ['/our-doctors', '/how-it-works', '/blog'];

export default function ThemeInitializer() {
  const pathname = usePathname();
  const resolveTheme = useThemeStore((s) => s.resolveTheme);

  useEffect(() => {
    const isLanding =
      pathname === '/' ||
      LANDING_ROOTS.some(
        (root) => pathname === root || pathname.startsWith(root + '/')
      );

    if (isLanding) {
      document.documentElement.classList.remove('dark');
    } else {
      resolveTheme();
    }
  }, [pathname, resolveTheme]);

  return null;
}
