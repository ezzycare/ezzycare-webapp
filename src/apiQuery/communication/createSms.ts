import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { SendSmsParams, SendSmsResponse } from './types';

export const sendSms = async (
  params: SendSmsParams
): Promise<SendSmsResponse> => {
  try {
    const response = await axiosClient.post<SendSmsResponse>(
      '/communication/sms',
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

export const useSendSmsMutation = (
  options?: UseMutationOptions<SendSmsResponse, unknown, SendSmsParams>
): UseMutationResult<SendSmsResponse, unknown, SendSmsParams> => {
  return useMutation({
    mutationFn: sendSms,
    ...options,
  });
};
