import { axiosClient } from '@/services/axiosClient';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { ApiResponse } from '../types';

export type CategoryType = 'DOCTOR' | 'HOSPITAL';

export interface GetCategoriesParams {
  type: CategoryType;
}

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  children: Category[];
};

export type GetCategoriesResponse = Category[];

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
) => {
  const result = useQuery({
    queryKey: ['categories', params.type],
    queryFn: () => getCategories(params),
    staleTime: 5 * 60 * 1000, // categories rarely change — cache for 5 min
    ...options,
  });

  return {
    ...result,
    categories: result.data?.data,
  };
};
