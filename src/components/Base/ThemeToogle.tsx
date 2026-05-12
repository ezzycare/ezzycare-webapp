'use client';

import { useThemeStore } from '@/stores/themeStore';

export default function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="
        w-12 h-7 flex items-center
        bg-surface border border-border1
        rounded-full p-1
        transition
      "
      aria-label="Toggle Theme"
    >
      <div
        className={`
          w-5 h-5 rounded-full
          bg-primary
          transform transition duration-300
          ${isDark ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
