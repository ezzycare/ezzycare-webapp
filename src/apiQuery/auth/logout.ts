import { removeSession } from '@/serverActions/getSession';
import { useAuthStore } from '@/stores/authStore';

export const handleLogout = async () => {
  try {
    useAuthStore.getState().removeAuth();

    await removeSession();

    window.location.reload();
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
