import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { CreateRoomResponse } from './types';

export const createTwilioRoom = async (): Promise<CreateRoomResponse> => {
  try {
    const response = await axiosClient.post<CreateRoomResponse>(
      '/communication/twilio/room'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useCreateTwilioRoomMutation = (
  options?: UseMutationOptions<CreateRoomResponse, unknown, void>
): UseMutationResult<CreateRoomResponse, unknown, void> => {
  return useMutation({
    mutationFn: createTwilioRoom,
    ...options,
  });
};
