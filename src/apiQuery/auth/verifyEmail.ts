import { ApiResponse } from '@/apiQuery/types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '../baseUrl';
import { VerifiedUserResponse } from './types';

export type VerifyEmailPayload = {
  email: string;
  code: string;
};

export const verifyEmail = async (
  payload: VerifyEmailPayload
): Promise<ApiResponse<VerifiedUserResponse>> => {
  try {
    const response = await axios.post<ApiResponse<VerifiedUserResponse>>(
      `${baseURL}/auth/verify-email`,
      payload
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useVerifyEmail = (
  options?: UseMutationOptions<
    ApiResponse<VerifiedUserResponse>,
    unknown,
    VerifyEmailPayload
  >
): UseMutationResult<
  ApiResponse<VerifiedUserResponse>,
  unknown,
  VerifyEmailPayload
> => {
  return useMutation<
    ApiResponse<VerifiedUserResponse>,
    unknown,
    VerifyEmailPayload
  >({
    mutationFn: verifyEmail,
    ...options,
  });
};
