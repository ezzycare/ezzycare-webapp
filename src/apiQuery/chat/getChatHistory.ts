import { axiosClient } from '@/services/axiosClient';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { ChatHistoryResponse } from './types';

interface GetChatHistoryParams {
  peerId: string;
}

export const getChatHistory = async (
  params: GetChatHistoryParams
): Promise<ChatHistoryResponse> => {
  if (!params.peerId) {
    throw new Error('peerId is required');
  }

  try {
    const response = await axiosClient.get<ChatHistoryResponse>(
      `/chat/history/${params.peerId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetChatHistoryQuery = (
  params: GetChatHistoryParams,
  options?: Omit<
    UseQueryOptions<ChatHistoryResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['chat', 'history', params.peerId],
    queryFn: () => getChatHistory(params),
    enabled: !!params.peerId,
    ...options,
  });

  return {
    ...result,
    messages: result.data?.data ?? [],
  };
};
