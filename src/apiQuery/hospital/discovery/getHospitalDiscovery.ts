import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

interface DiscoveryPageParam {
  search?: string;
  services?: string;
  page: number;
  limit: number;
}

export interface HospitalDiscoveryItem {
  id: string;
  hospitalName: string;
  profileImage: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  clinicPlace: string | null;
  latitude: number;
  longitude: number;
  rating: number;
  totalDoctors: number;
}

export interface HospitalDiscoveryMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HospitalDiscoveryData {
  items: HospitalDiscoveryItem[];
  meta: HospitalDiscoveryMeta;
}

interface DiscoveryFilters {
  search?: string;
  services?: string;
}

export const getHospitalDiscovery = async ({
  page,
  limit,
  ...params
}: DiscoveryPageParam): Promise<ApiResponse<HospitalDiscoveryData>> => {
  console.log({ params });
  try {
    const response = await axiosClient.get<ApiResponse<HospitalDiscoveryData>>(
      '/hospitals-discovery',
      { params: { page, limit, ...params } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalDiscovery = ({
  limit = 10,
  ...params
}: DiscoveryFilters & { limit?: number } = {}) => {
  const paramsKey = JSON.stringify(params);

  const result = useInfiniteQuery({
    queryKey: ['hospitals', 'discovery', limit, paramsKey],
    queryFn: ({ pageParam }) =>
      getHospitalDiscovery({ page: pageParam, limit, ...params }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const meta = lastPage?.data?.meta;
      return meta?.hasNextPage ? (lastPageParam as number) + 1 : undefined;
    },
  });

  const hospitals = useMemo(
    () =>
      result.data?.pages.flatMap((p) => {
        const { items } = p.data ?? {};
        return items ?? [];
      }) ?? [],
    [result.data]
  );

  return {
    ...result,
    hospitals,
  };
};
