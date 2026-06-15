import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface MarkReadParams {
  peerId: string;
}

export const markChatRead = async (
  params: MarkReadParams
): Promise<ApiResponse<unknown>> => {
  if (!params.peerId) {
    throw new Error('peerId is required');
  }

  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      `/chat/read/${params.peerId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useMarkChatReadMutation = (
  options?: UseMutationOptions<ApiResponse<unknown>, unknown, MarkReadParams>
): UseMutationResult<ApiResponse<unknown>, unknown, MarkReadParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markChatRead,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversations'],
      });
    },

    ...options,
  });
};
