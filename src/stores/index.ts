import { create } from 'zustand';
import { AuthStore, useAuthStore } from './authStore';
import { GlobalStore, useGlobalStore } from './globalStore';
import { ToastStore, useToastStore } from './toastStore';

export interface RootStore extends ToastStore, AuthStore, GlobalStore {}

export const useMainStore = create<RootStore>((set, get) => ({
  ...useGlobalStore(set, get),
  ...useAuthStore(set, get),
  ...useToastStore(set, get),
}));
