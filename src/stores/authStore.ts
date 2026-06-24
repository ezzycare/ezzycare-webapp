import { ACCOUNT_TYPE, User } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
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
  doctorUser: DoctorProfile;
  authToken: string | null;
  signupDetails: SignupDetails;
  passwordResetToken: string | null;
  profileCompleted?: boolean;
  updateUser: (user: User) => void;
  updateDoctorUser: (user: DoctorProfile) => void;
  setToken: (token: string) => void;
  removeAuth: () => void;
  updateSignupDetails: (details: Partial<SignupDetails>) => void;
  setPasswordResetToken: (token: string) => void;
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

const getInitialDoctorUser = (): DoctorProfile => {
  if (!isBrowser) return {} as DoctorProfile;
  try {
    const stored = localStorage.getItem(general.DOCTOR_USER);
    return stored ? JSON.parse(stored) : ({} as DoctorProfile);
  } catch {
    return {} as DoctorProfile;
  }
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      forgotPasswordEmail: null,
      user: getInitialUser(),
      doctorUser: getInitialDoctorUser(),
      authToken: getAuthToken(),
      signupDetails: {} as SignupDetails,
      passwordResetToken: null,

      isAuthenticated: () => !!getAuthToken(),

      setForgotPasswordEmail: (email) => set({ forgotPasswordEmail: email }),

      updateUser: (user) => {
        set({ user });
        if (isBrowser) localStorage.setItem(general.USER, JSON.stringify(user));
      },

      updateDoctorUser: (user) => {
        set({ doctorUser: user });
        if (isBrowser)
          localStorage.setItem(general.DOCTOR_USER, JSON.stringify(user));
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
          localStorage.removeItem(general.DOCTOR_USER);
        }
      },

      updateSignupDetails: (details) =>
        set((state) => ({
          signupDetails: { ...state.signupDetails, ...details },
        })),

      setPasswordResetToken: (token) => set({ passwordResetToken: token }),
    }),
    { name: 'authStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
