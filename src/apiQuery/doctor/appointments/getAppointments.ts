import { axiosClient } from '@/services/axiosClient';
import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';
import {
  DoctorAppointment,
  DoctorAppointmentsResponse,
  GetDoctorAppointmentsParams,
} from './types';

export const getDoctorAppointments = async (
  params?: GetDoctorAppointmentsParams
): Promise<DoctorAppointmentsResponse> => {
  try {
    const response = await axiosClient.get<DoctorAppointmentsResponse>(
      '/doctors/appointments',
      {
        params: {
          ...params,
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
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

export const useGetDoctorAppointmentsInfiniteQuery = (
  params?: Omit<GetDoctorAppointmentsParams, 'page'> & { enabled?: boolean },
  options?: Omit<
    UseInfiniteQueryOptions<
      DoctorAppointmentsResponse,
      Error,
      InfiniteData<DoctorAppointmentsResponse>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam' | 'enabled'
  >
) => {
  const { enabled, ...apiParams } = params ?? {};

  const result = useInfiniteQuery({
    queryKey: ['doctor', 'appointments', 'infinite', apiParams] as const,
    queryFn: ({ pageParam }) =>
      getDoctorAppointments({ ...apiParams, page: pageParam }),
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      if (!meta) return undefined;
      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const appointments = useMemo<DoctorAppointment[]>(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    appointments,
  };
};
