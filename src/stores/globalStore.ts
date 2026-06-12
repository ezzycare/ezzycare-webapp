/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface GlobalStore {
  loading: boolean;
  user: any;
  setLoading: (loading: boolean) => void;
  updateUser: (user: any) => void;
}

export const useGlobalStore = create<GlobalStore>()(
  devtools(
    (set) => ({
      loading: false,
      user: {},
      setLoading: (loading: boolean) => set({ loading }),
      updateUser: (user: any) => set({ user }),
    }),
    { name: 'globalStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
