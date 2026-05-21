/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthStore {
  forgotPasswordEmail: string | null;
  setForgotPasswordEmail: (email: string) => void;
  hospitalRegDetails: {
    email: string;
    hospitalName: string;
    phone: string;
    location: string;
    adminName: string;
    password: string;
    docs: {
      cac: File | null;
      license: File | null;
      permit: File | null;
      address: File | null;
    };
  };
}

export const useAuthStore = (set: any, get?: any) => ({
  forgotPasswordEmail: null,
  hospitalRegDetails: {
    email: '',
    hospitalName: '',
    phone: '',
    location: '',
    adminName: '',
    password: '',
    docs: {
      cac: null,
      license: null,
      permit: null,
      address: null,
    },
  },
  setForgotPasswordEmail: (email: string) =>
    set({ forgotPasswordEmail: email }),
  setHospitalRegDetails: (details: any) => set({ hospitalRegDetails: details }),
  updateHospitalRegDetails: (details: any) =>
    set((state: any) => ({
      hospitalRegDetails: { ...state.hospitalRegDetails, ...details },
    })),
});
