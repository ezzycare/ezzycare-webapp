import { User } from '@/apiQuery/hospital/auth/types';
import { general } from '@/enums';
import { getAuthToken } from '@/services/getAuthToken';
import { create } from 'zustand';

export interface HospitalDocs {
  cac: File | null;
  license: File | null;
  permit: File | null;
  address: File | null;
}

export interface HospitalRegDetails {
  firstName: string;
  lastName: string;
  hospitalName: string;
  email: string;
  mobileNo: string;
  password: string;
  location: string;
  accountType: 'HOSPITAL';
  phone: string;
  adminName?: string;
  docs: HospitalDocs;
}

export interface AuthStore {
  forgotPasswordEmail: string | null;
  isAuthenticated: () => boolean;
  setForgotPasswordEmail: (email: string) => void;
  user: User;
  authToken: string | null;
  hospitalRegDetails: HospitalRegDetails;
  updateUser: (user: User) => void;
  setToken: (token: string) => void;
  removeAuth: () => void;
  updateHospitalRegDetails: (details: Partial<HospitalRegDetails>) => void;
}

const isBrowser = typeof window !== 'undefined';

export const useAuthStore = create<AuthStore>((set) => ({
  forgotPasswordEmail: null,
  user: {} as User,
  authToken: getAuthToken(),
  hospitalRegDetails: {} as HospitalRegDetails,

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

  updateHospitalRegDetails: (details) =>
    set((state) => ({
      hospitalRegDetails: { ...state.hospitalRegDetails, ...details },
    })),
}));
