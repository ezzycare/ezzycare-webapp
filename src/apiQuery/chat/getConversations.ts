import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import {
  Conversation,
  ConversationsData,
  ConversationsResponse,
} from './types';

interface GetConversationsParams {
  page?: number;
  limit?: number;
}

export const getConversations = async (
  params?: GetConversationsParams
): Promise<ConversationsResponse> => {
  try {
    const response = await axiosClient.get<ConversationsResponse>(
      '/chat/list',
      {
        params: { page: params?.page ?? 1, limit: params?.limit ?? 20 },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetConversationsInfiniteQuery = (
  params?: Omit<GetConversationsParams, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      ConversationsResponse,
      Error,
      InfiniteData<ConversationsResponse>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['chat', 'conversations', 'infinite', params],
    queryFn: ({ pageParam }) =>
      getConversations({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      return meta?.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const conversations = useMemo<Conversation[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    conversations,
  };
};
