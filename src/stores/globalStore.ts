/* eslint-disable @typescript-eslint/no-explicit-any */
export const useGlobalStore = (set: any) => ({
  loading: false,
  user: {},
  setLoading: (loading: boolean) => set({ loading }),
  updateUser: (user: any) => set({ user }),
});
