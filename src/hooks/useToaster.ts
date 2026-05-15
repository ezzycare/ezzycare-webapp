import { RootStore, useMainStore } from '@/stores';

export const useToaster = () => {
  const addToast = useMainStore((state: RootStore) => state.addToast);

  return {
    success: (message: string) => addToast({ type: 'success', message }),
    error: (message: string) => addToast({ type: 'error', message }),
  };
};
