import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { PaymentParams } from './initiatePayment';

export interface PayWithWalletResponse {
  success: boolean;
  message: string;
  reference: string;
  newBalance: number;
}

export const payWithWallet = async (
  params: PaymentParams
): Promise<ApiResponse<PayWithWalletResponse>> => {
  try {
    const response = await axiosClient.post<ApiResponse<PayWithWalletResponse>>(
      '/payment/wallet/pay',
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

export const usePayWithWalletMutation = (
  options?: UseMutationOptions<
    ApiResponse<PayWithWalletResponse>,
    unknown,
    PaymentParams
  >
): UseMutationResult<
  ApiResponse<PayWithWalletResponse>,
  unknown,
  PaymentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: payWithWallet,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },

    ...options,
  });
};
