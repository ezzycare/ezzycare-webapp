/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@/apiQuery/types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export const forgotPassword = async (
  payload: ForgotPasswordPayload
): Promise<ApiResponse<ForgotPasswordResponse>> => {
  try {
    const response = await axios.post<ApiResponse<ForgotPasswordResponse>>(
      `${baseURL}/auth/forgot-password`,
      payload
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const useForgotPasswordMutation = (
  options?: UseMutationOptions<
    ApiResponse<ForgotPasswordResponse>,
    unknown,
    ForgotPasswordPayload
  >
): UseMutationResult<
  ApiResponse<ForgotPasswordResponse>,
  unknown,
  ForgotPasswordPayload
> => {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
};
