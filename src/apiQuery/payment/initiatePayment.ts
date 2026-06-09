import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';

export interface InitializePaymentParams {
  amount: number;
  email: string;
  appointmentId?: number;
  orderId?: number;
  callbackUrl: string;
}

export interface InitializePaymentResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export const initializePayment = async (
  params: InitializePaymentParams
): Promise<ApiResponse<InitializePaymentResponse>> => {
  try {
    const response = await axiosClient.post<
      ApiResponse<InitializePaymentResponse>
    >('/payment/initialize', params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useInitializePaymentMutation = (
  options?: UseMutationOptions<
    ApiResponse<InitializePaymentResponse>,
    unknown,
    InitializePaymentParams
  >
): UseMutationResult<
  ApiResponse<InitializePaymentResponse>,
  unknown,
  InitializePaymentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializePayment,

    onSuccess: () => {
      // Invalidate appointments — its payment status may have changed to "initialized"
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },

    ...options,
  });
};
