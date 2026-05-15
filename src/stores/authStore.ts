/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthStore {
  forgotPasswordEmail: string | null;
  setForgotPasswordEmail: (email: string) => void;
}

export const useAuthStore = (set: any, get?: any) => ({
  forgotPasswordEmail: null,
  setForgotPasswordEmail: (email: string) =>
    set({ forgotPasswordEmail: email }),
});
