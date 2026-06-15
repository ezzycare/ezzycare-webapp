import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  useQuery,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import {
  AddBankAccountParams,
  BankAccount,
  BankAccountsResponse,
} from './types';

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
