import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';

  setTheme: (theme: Theme) => void;
  resolveTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'light',
        resolvedTheme: 'light',

        setTheme: (theme) => {
          set({ theme });

          const resolved = theme === 'system' ? getSystemTheme() : theme;

          set({ resolvedTheme: resolved });

          document.documentElement.classList.toggle(
            'dark',
            resolved === 'dark'
          );
        },

        resolveTheme: () => {
          const theme = get().theme;

          const resolved = theme === 'system' ? getSystemTheme() : theme;

          set({ resolvedTheme: resolved });

          document.documentElement.classList.toggle(
            'dark',
            resolved === 'dark'
          );
        },
      }),
      {
        name: 'theme-preference',
        onRehydrateStorage: () => (state) => {
          // re-apply theme after hydration
          state?.resolveTheme();
        },
      }
    ),
    { name: 'themeStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
