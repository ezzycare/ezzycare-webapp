/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from '@/apiQuery/types';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export interface VerifyForgotPasswordOtpPayload {
  email: string;
  code: string;
}

export interface VerifyForgotPasswordOtpResponse {
  access_token: string;
}

export const verifyForgotPasswordOtp = async (
  payload: VerifyForgotPasswordOtpPayload
): Promise<ApiResponse<VerifyForgotPasswordOtpResponse>> => {
  try {
    const response = await axios.post<
      ApiResponse<VerifyForgotPasswordOtpResponse>
    >(`${baseURL}/auth/verify-forgot-password-otp`, payload);

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const useVerifyForgotPasswordOtpMutation = (
  options?: UseMutationOptions<
    ApiResponse<VerifyForgotPasswordOtpResponse>,
    unknown,
    VerifyForgotPasswordOtpPayload
  >
): UseMutationResult<
  ApiResponse<VerifyForgotPasswordOtpResponse>,
  unknown,
  VerifyForgotPasswordOtpPayload
> => {
  return useMutation({
    mutationFn: verifyForgotPasswordOtp,
    ...options,
  });
};
