import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface ReadNotificationParams {
  id: string;
}

export const readNotification = async (
  params: ReadNotificationParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/notifications/${params.id}/read`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useReadNotificationMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    ReadNotificationParams
  >
): UseMutationResult<ApiResponse<unknown>, unknown, ReadNotificationParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: readNotification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['notifications'],
      });
    },

    ...options,
  });
};
