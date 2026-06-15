import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import {
  SendMessageData,
  SendMessageParams,
  SendMessageResponse,
} from './types';

export const sendMessage = async (
  params: SendMessageParams
): Promise<SendMessageResponse> => {
  try {
    const response = await axiosClient.post<SendMessageResponse>(
      '/chat/send',
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

export const useSendMessageMutation = (
  options?: UseMutationOptions<SendMessageResponse, unknown, SendMessageParams>
): UseMutationResult<SendMessageResponse, unknown, SendMessageParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chat', 'conversations'],
      });
    },

    ...options,
  });
};
