import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import { general } from '@/enums';
import { getAuthToken } from '@/services/getAuthToken';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Docs {
  cac: File | null;
  license: File | null;
  permit: File | null;
  address: File | null;
}

export interface SignupDetails {
  firstName: string;
  lastName: string;
  Name: string;
  email: string;
  mobileNo: string;
  password: string;
  location: string;
  accountType: ACCOUNT_TYPE;
  phone: string;
  adminName?: string;
  docs: Docs;
}

export interface AuthStore {
  forgotPasswordEmail: string | null;
  isAuthenticated: () => boolean;
  setForgotPasswordEmail: (email: string) => void;
  user: User;
  authToken: string | null;
  signupDetails: SignupDetails;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
  removeAuth: () => void;
  updateSignupDetails: (details: Partial<SignupDetails>) => void;
}

const isBrowser = typeof window !== 'undefined';

const getInitialUser = (): User => {
  if (!isBrowser) return {} as User;
  try {
    const stored = localStorage.getItem(general.USER);
    return stored ? JSON.parse(stored) : ({} as User);
  } catch {
    return {} as User;
  }
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      forgotPasswordEmail: null,
      user: getInitialUser(),
      authToken: getAuthToken(),
      signupDetails: {} as SignupDetails,

      isAuthenticated: () => !!getAuthToken(),

      setForgotPasswordEmail: (email) => set({ forgotPasswordEmail: email }),

      updateUser: (user) => {
        set({ user });
        if (isBrowser) localStorage.setItem(general.USER, JSON.stringify(user));
      },

      setToken: (token) => {
        set({ authToken: token });
        if (isBrowser) sessionStorage.setItem(general.TOKEN, token);
      },

      removeAuth: () => {
        set({ user: {} as User, authToken: null });
        if (isBrowser) {
          sessionStorage.removeItem(general.TOKEN);
          localStorage.removeItem(general.USER);
        }
      },

      updateSignupDetails: (details) =>
        set((state) => ({
          signupDetails: { ...state.signupDetails, ...details },
        })),
    }),
    { name: 'authStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
