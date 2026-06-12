import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { type ApiResponse } from '@/apiQuery/types';

import { type DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { axiosClient } from '@/services/axiosClient';
import { type CreateAppointmentInterface } from '../post/createAppointment';

export type AppointmentListType = 'provider' | 'client';

export type AppointmentStatus =
  | 'PENDING'
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'PAID'
  | 'UNPAID'
  | 'COMPLETED'
  | 'CANCELLED';

export interface GetAppointmentsParams {
  type?: AppointmentListType;
  status?: AppointmentStatus;
  limit?: number;
}

export interface AppointmentDoctorDetails {
  clinicHospitalName: string;
  address: string;
}

export interface AppointmentUser {
  firstName: string;
  lastName: string;
  profileImage: string | null;
  categoryId?: string | null;
  userDetails?: AppointmentDoctorDetails | null;
}

export interface AppointmentListItem extends CreateAppointmentInterface {
  user: AppointmentUser;
  client: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
  };
  uid: number;
  seekerUid: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AppointmentsResponse {
  items: AppointmentListItem[];
  meta: PaginationMeta;
}

export type AppointmentWithDoctor = AppointmentListItem & {
  doctor?: DoctorProfile;
};

export const getAppointments = async (
  params?: GetAppointmentsParams & { page?: number }
): Promise<ApiResponse<AppointmentsResponse>> => {
  const response = await axiosClient.get<ApiResponse<AppointmentsResponse>>(
    '/healthcare/appointments',
    {
      params,
    }
  );

  return response.data;
};

type InfiniteAppointmentsOptions = Omit<
  UseInfiniteQueryOptions<
    ApiResponse<AppointmentsResponse>, // TQueryFnData (per-page)
    Error, // TError
    InfiniteData<ApiResponse<AppointmentsResponse>>, // TData (the wrapped result)
    readonly unknown[], // TQueryKey
    number // TPageParam
  >,
  'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export const useGetAppointmentsInfiniteQuery = (
  params?: GetAppointmentsParams,
  options?: InfiniteAppointmentsOptions
) => {
  const result = useInfiniteQuery({
    queryKey: ['healthcare', 'appointments', 'infinite', params] as const,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAppointments({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      if (!meta) return undefined;
      return meta.hasNextPage ? meta.page + 1 : undefined;
    },
    ...options,
  });

  const appointments = useMemo(
    () => result.data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [result.data]
  );

  return {
    ...result,
    appointments,
  };
};
