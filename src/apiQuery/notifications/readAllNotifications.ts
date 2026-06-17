import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

export const readAllNotifications = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/notifications/read-all'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useReadAllNotificationsMutation = (
  options?: UseMutationOptions<ApiResponse<unknown>, unknown, void>
): UseMutationResult<ApiResponse<unknown>, unknown, void> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readAllNotifications,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },

    ...options,
  });
};
