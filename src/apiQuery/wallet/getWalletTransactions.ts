import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import {
  WalletTransaction,
  WalletTransactionsData,
  WalletTransactionsResponse,
} from './types';

interface GetWalletTransactionsParams {
  page?: number;
  limit?: number;
}

export const getWalletTransactions = async (
  params?: GetWalletTransactionsParams
): Promise<WalletTransactionsResponse> => {
  try {
    const response = await axiosClient.get<WalletTransactionsResponse>(
      '/wallet/transactions',
      { params: { page: params?.page ?? 1, limit: params?.limit ?? 20 } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetWalletTransactionsInfiniteQuery = (
  params?: Omit<GetWalletTransactionsParams, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      WalletTransactionsResponse,
      Error,
      InfiniteData<WalletTransactionsResponse>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['wallet', 'transactions', 'infinite', params],
    queryFn: ({ pageParam }) =>
      getWalletTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      return meta?.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const transactions = useMemo<WalletTransaction[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    transactions,
  };
};
