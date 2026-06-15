import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ServicesType {
  id: string;
  name: string;
}
export interface ServicesStore {
  services: ServicesType[];
  setServices: (services: ServicesType[]) => void;
}

export const useServicesStore = create<ServicesStore>()(
  devtools(
    (set) => ({
      services: [],

      setServices: (services) => set({ services }),
    }),
    { name: 'servicesStore', enabled: process.env.NODE_ENV === 'development' }
  )
);
