import { removeSession } from '@/serverActions/getSession';
import { AuthStore, useAuthStore } from '@/stores/authStore';

export const handleLogout = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const authStore = useAuthStore((state: AuthStore) => state);
  try {
    authStore.removeAuth();
    await removeSession();

    window?.location?.reload();
  } catch (error) {}
};
