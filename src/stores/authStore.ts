/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAuthStore = (set: any) => ({
  forgotPasswordEmail: null,
  setForgotPasswordEmail: (email: string) =>
    set({ forgotPasswordEmail: email }),
});
