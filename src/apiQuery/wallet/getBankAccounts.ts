import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BankAccountsResponse } from './types';

export const getBankAccounts = async (): Promise<BankAccountsResponse> => {
  try {
    const response = await axiosClient.get<BankAccountsResponse>(
      '/wallet/bank-accounts'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetBankAccounts = () => {
  const result = useQuery<BankAccountsResponse, Error>({
    queryKey: ['wallet', 'bank-accounts'],
    queryFn: getBankAccounts,
  });

  return {
    ...result,
    accounts: result.data?.data ?? [],
  };
};
