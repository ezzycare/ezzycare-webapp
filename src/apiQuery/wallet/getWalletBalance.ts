import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { WalletBalance, WalletBalanceResponse } from './types';

export const getWalletBalance = async (): Promise<WalletBalanceResponse> => {
  try {
    const response =
      await axiosClient.get<WalletBalanceResponse>('/wallet/balance');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetWalletBalance = () => {
  const result = useQuery<WalletBalanceResponse, Error>({
    queryKey: ['wallet', 'balance'],
    queryFn: getWalletBalance,
  });

  return {
    ...result,
    balance: result.data?.data ?? ({} as WalletBalance),
  };
};
