import { create } from 'zustand';
import { AuthStore, useAuthStore } from './authStore';
import { GlobalStore, useGlobalStore } from './globalStore';

export interface RootStore extends AuthStore, GlobalStore {}

export const useMainStore = create<RootStore>((set, get) => ({
  ...useGlobalStore(set, get),
  ...useAuthStore(set, get),
}));
