import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { ChatHistoryData, ChatHistoryResponse, ChatMessage } from './types';

interface GetChatHistoryParams {
  peerId: string;
  lastId?: string;
}

export const getChatHistory = async (
  params: GetChatHistoryParams
): Promise<ChatHistoryResponse> => {
  if (!params.peerId) {
    throw new Error('peerId is required');
  }

  try {
    const response = await axiosClient.get<ChatHistoryResponse>(
      `/chat/history/${params.peerId}`,
      { params: { lastId: params.lastId } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetChatHistoryInfiniteQuery = (
  params: GetChatHistoryParams,
  options?: Omit<
    UseInfiniteQueryOptions<
      ChatHistoryResponse,
      Error,
      InfiniteData<ChatHistoryResponse>,
      readonly unknown[],
      string | undefined
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['chat', 'history', params.peerId],
    queryFn: ({ pageParam }) =>
      getChatHistory({ ...params, lastId: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      return meta?.hasMore ? meta.lastId : undefined;
    },
    enabled: !!params.peerId,
    ...options,
  });

  const messages = useMemo<ChatMessage[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    messages,
  };
};
