'use client';

import { useTheme } from '@/hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-12 h-7 flex items-center
        bg-surface border border-border
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
          ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
        `}
      />
    </button>
  );
}
