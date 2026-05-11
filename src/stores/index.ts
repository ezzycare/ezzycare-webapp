import { create } from 'zustand';
import { useAuthStore } from './authStore';
import { useGlobalStore } from './globalStore';

export const useMainStore = create((set) => ({
  ...useGlobalStore(set),
  ...useAuthStore(set),
}));
