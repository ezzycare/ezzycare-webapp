import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { VerifyBankAccountParams, VerifyBankAccountResponse } from './types';

export const verifyBankAccount = async (
  params: VerifyBankAccountParams
): Promise<VerifyBankAccountResponse> => {
  try {
    const response = await axiosClient.post<VerifyBankAccountResponse>(
      '/wallet/verify-bank-account',
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

export const useVerifyBankAccountMutation = (
  options?: UseMutationOptions<
    VerifyBankAccountResponse,
    unknown,
    VerifyBankAccountParams
  >
): UseMutationResult<
  VerifyBankAccountResponse,
  unknown,
  VerifyBankAccountParams
> => {
  return useMutation({
    mutationFn: verifyBankAccount,
    ...options,
  });
};
