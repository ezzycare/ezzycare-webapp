/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@/apiQuery/types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export interface ResetPasswordPayload {
  newPassword: string;
  token: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const resetPassword = async (
  payload: ResetPasswordPayload
): Promise<ApiResponse<ResetPasswordResponse>> => {
  try {
    const response = await axios.post<ApiResponse<ResetPasswordResponse>>(
      `${baseURL}/auth/reset-password`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payload.token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const useResetPasswordMutation = (
  options?: UseMutationOptions<
    ApiResponse<ResetPasswordResponse>,
    unknown,
    ResetPasswordPayload
  >
): UseMutationResult<
  ApiResponse<ResetPasswordResponse>,
  unknown,
  ResetPasswordPayload
> => {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
};
