import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';

export interface VerifyReferenceResponse {
  success: boolean;
  message: string;
  reference: string;
  status: string;
  appointmentId: number;
}

export const verifyReference = async (
  reference: string
): Promise<ApiResponse<VerifyReferenceResponse>> => {
  try {
    const response = await axiosClient.get<
      ApiResponse<VerifyReferenceResponse>
    >(`/payment/verify/${reference}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useVerifyReferenceQuery = (
  reference: string | null,
  options?: Omit<
    UseQueryOptions<ApiResponse<VerifyReferenceResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['payment', 'verify', reference],
    queryFn: () => verifyReference(reference!),
    enabled: !!reference,
    retry: 1,
    ...options,
  });

  return {
    ...result,
    verification: result.data?.data,
  };
};
