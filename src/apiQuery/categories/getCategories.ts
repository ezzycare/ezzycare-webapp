import { axiosClient } from '@/services/axiosClient';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import { ApiResponse } from '../types';

export type CategoryType = 'DOCTOR' | 'HOSPITAL';

export interface GetCategoriesParams {
  type: CategoryType;
}

export type GetCategoriesResponse = {
  id: number;
  name: string;
  type: CategoryType;
  // adjust to match your API — common extras: slug, icon, createdAt, etc.
}[];

export const getCategories = async (
  params: GetCategoriesParams
): Promise<ApiResponse<GetCategoriesResponse>> => {
  const response = await axiosClient.get<ApiResponse<GetCategoriesResponse>>(
    `/categories`,
    { params }
  );
  return response.data;
};

export const useGetCategoriesQuery = (
  params: GetCategoriesParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetCategoriesResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<ApiResponse<GetCategoriesResponse>, unknown> => {
  return useQuery({
    queryKey: ['categories', params.type],
    queryFn: () => getCategories(params),
    staleTime: 5 * 60 * 1000, // categories rarely change — cache for 5 min
    ...options,
  });
};
