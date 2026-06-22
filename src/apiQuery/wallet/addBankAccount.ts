import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { BankAccount } from '../auth/types';
import { AddBankAccountParams } from './types';

export const addBankAccount = async (
  params: AddBankAccountParams
): Promise<ApiResponse<BankAccount>> => {
  try {
    const response = await axiosClient.post<ApiResponse<BankAccount>>(
      '/wallet/bank-accounts',
      params
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useAddBankAccountMutation = (
  options?: UseMutationOptions<
    ApiResponse<BankAccount>,
    unknown,
    AddBankAccountParams
  >
): UseMutationResult<
  ApiResponse<BankAccount>,
  unknown,
  AddBankAccountParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addBankAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wallet', 'bank-accounts'],
      });
    },

    ...options,
  });
};
