export type ToastType = 'success' | 'error';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useToastStore = (set: any, get?: any) => ({
  toasts: [] as Toast[],
  addToast: (toast: Omit<Toast, 'id'>) => {
    set((state: ToastStore) => ({
      toasts: [...state.toasts, { id: Date.now().toString(), ...toast }],
    }));
  },
  removeToast: (id: string) => {
    set((state: ToastStore) => ({
      toasts: state.toasts.filter((t: Toast) => t.id !== id),
    }));
  },
});
