import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  // Apply theme to <html>
  const applyTheme = (t: Theme) => {
    const root = document.documentElement;

    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', t);
    setTheme(t);
  };

  // Toggle
  const toggleTheme = () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Init
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;

    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      applyTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  return { theme, toggleTheme, setTheme: applyTheme };
}
