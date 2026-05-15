/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GlobalStore {
  loading: boolean;
  user: any;
  setLoading: (loading: boolean) => void;
  updateUser: (user: any) => void;
}

export const useGlobalStore = (set: any, get?: any) => ({
  loading: false,
  user: {},
  setLoading: (loading: boolean) => set({ loading }),
  updateUser: (user: any) => set({ user }),
});
