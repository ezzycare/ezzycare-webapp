import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import {
  GetNotificationsParams,
  Notification,
  NotificationsResponse,
} from './types';

export const getNotifications = async (
  params?: GetNotificationsParams
): Promise<NotificationsResponse> => {
  try {
    const response = await axiosClient.get<NotificationsResponse>(
      '/notifications',
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

export const useGetNotificationsInfiniteQuery = (
  params?: Omit<GetNotificationsParams, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      NotificationsResponse,
      Error,
      InfiniteData<NotificationsResponse>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['notifications', 'infinite', params] as const,
    queryFn: ({ pageParam }) =>
      getNotifications({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      if (!meta) return undefined;
      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const notifications = useMemo<Notification[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    notifications,
  };
};
