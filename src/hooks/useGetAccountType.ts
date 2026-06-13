import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { getCookie } from '@/services/getAuthToken';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { getAccountNavItems } from '@/utils/route';

export const useGetAccountType = (): {
  accountType: ACCOUNT_TYPE;
  accountNavItems: string[];
  loading: boolean;
} => {
  const authStore = useAuthStore((state: AuthStore) => state);
  const accountType: ACCOUNT_TYPE =
    authStore?.user?.accountType || getCookie()?.user?.accountType;

  return {
    loading: !accountType,
    accountType,
    accountNavItems: accountType ? getAccountNavItems(accountType) : [],
  };
};
