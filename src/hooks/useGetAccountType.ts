import { ACCOUNT_TYPE } from '@/apiQuery/hospital/auth/types';
import { getCookie } from '@/services/getAuthToken';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { getAccountNavItems } from '@/utils/route';

export const useGetAccountType = (): {
  accountType: ACCOUNT_TYPE;
  accountNavItems: string[];
} => {
  const authStore = useAuthStore((state: AuthStore) => state);
  const accountType =
    getCookie()?.user?.accountType || authStore?.user?.accountType;

  return {
    accountType,
    accountNavItems: getAccountNavItems(accountType),
  };
};
