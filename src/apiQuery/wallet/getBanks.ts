import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Bank, ListBanksResponse } from './types';

export const getBanks = async (): Promise<ListBanksResponse> => {
  try {
    const response =
      await axiosClient.get<ListBanksResponse>('/wallet/list-banks');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetBanks = () => {
  const result = useQuery<ApiResponse<Bank[]>, Error>({
    queryKey: ['wallet', 'banks'],
    queryFn: getBanks,
  });

  return {
    ...result,
    banks: result.data?.data ?? [],
  };
};
