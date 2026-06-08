import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { axiosClient } from '@/services/axiosClient';
import { ApiResponse } from '../types';

export type GetAccountTypesResponse = {
  id: number;
  name: string;
  code: string;
}[];

export const getAccountTypes = async (): Promise<
  ApiResponse<GetAccountTypesResponse>
> => {
  const response = await axiosClient.get<ApiResponse<GetAccountTypesResponse>>(
    `/categories/account-types`
  );
  return response.data;
};

export const useGetAccountTypesQuery = (
  options?: Omit<
    UseQueryOptions<ApiResponse<GetAccountTypesResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<ApiResponse<GetAccountTypesResponse>, unknown> => {
  return useQuery({
    queryKey: ['categories', 'account-types'],
    queryFn: getAccountTypes,
    staleTime: Infinity, // account types are essentially static
    ...options,
  });
};
