/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import { ApiResponse, RegisterHospitalPayload } from './types';

export const registerHospital = async (
  payload: RegisterHospitalPayload
): Promise<ApiResponse> => {
  try {
    const response = await axiosClient.post<ApiResponse>(
      '/auth/register',
      payload
    );

    return response.data;
  } catch (error: any) {
    if (error?.response?.data) {
      throw error.response.data;
    }

    throw error;
  }
};

export const useRegisterHospital = (
  options?: UseMutationOptions<ApiResponse, unknown, RegisterHospitalPayload>
): UseMutationResult<ApiResponse, unknown, RegisterHospitalPayload> => {
  return useMutation<ApiResponse, unknown, RegisterHospitalPayload>({
    mutationFn: registerHospital,
    ...options,
  });
};
