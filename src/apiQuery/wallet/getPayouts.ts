import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import { Payout, PayoutsResponse } from './types';

interface GetPayoutsParams {
  page?: number;
  limit?: number;
}

export const getPayouts = async (
  params?: GetPayoutsParams
): Promise<PayoutsResponse> => {
  try {
    const response = await axiosClient.get<PayoutsResponse>('/wallet/payouts', {
      params: { page: params?.page ?? 1, limit: params?.limit ?? 20 },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetPayoutsInfiniteQuery = (
  params?: Omit<GetPayoutsParams, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      PayoutsResponse,
      Error,
      InfiniteData<PayoutsResponse>,
      readonly unknown[],
      number
    >,
    | 'queryKey'
    | 'queryFn'
    | 'initialPageParam'
    | 'getNextPageParam'
    | 'getPreviousPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['wallet', 'payouts', 'infinite', params],
    queryFn: ({ pageParam }) => getPayouts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => {
      const meta = firstPage.data?.meta;
      return meta?.hasPreviousPage ? meta.page - 1 : undefined;
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      return meta?.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const payouts = useMemo<Payout[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    payouts,
  };
};
