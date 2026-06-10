import { useEffect, useMemo } from 'react';
import {
  useInfiniteQuery,
  useQueries,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/apiQuery/types';
import {
  getSingleDoctor,
  type DoctorProfile,
} from '@/apiQuery/doctor/getSingleDoctor';
import { axiosClient } from '@/services/axiosClient';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';

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

export interface AppointmentResponse {
  id: number;
  userId: number;
  hospitalId: number;
  appointmentType: string;
  status: AppointmentStatus;
  name: string;
  email: string;
  mobileNo: string;
  age: string;
  gender: string;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
  duration: number;
  address: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export type GetAppointmentsResponse = AppointmentResponse[];

export type AppointmentWithDoctor = AppointmentResponse & {
  doctor?: DoctorProfile;
};

export const getAppointments = async (
  params?: GetAppointmentsParams & { page?: number }
): Promise<ApiResponse<GetAppointmentsResponse>> => {
  const response = await axiosClient.get<ApiResponse<GetAppointmentsResponse>>(
    `/healthcare/appointments`,
    { params }
  );
  return response.data;
};

export const useGetAppointmentsInfiniteQuery = (
  params?: GetAppointmentsParams,
  options?: Omit<
    UseInfiniteQueryOptions<
      ApiResponse<GetAppointmentsResponse>,
      unknown,
      InfiniteData<ApiResponse<GetAppointmentsResponse>>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['healthcare', 'appointments', 'infinite', params],
    queryFn: ({ pageParam }) => getAppointments({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const data = lastPage.data;
      if (!data || data.length === 0) return undefined;
      if (params?.limit && data.length < params.limit) return undefined;
      return lastPageParam + 1;
    },
    ...options,
  });

  const appointments = useMemo(
    () => result.data?.pages.flatMap((page) => page.data ?? []) ?? [],
    [result.data?.pages]
  );

  const userIds = useMemo(
    () => [...new Set(appointments.map((a) => a.userId).filter(Boolean))],
    [appointments]
  );

  const doctorResults = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ['doctors-discovery', String(userId)],
      queryFn: () => getSingleDoctor({ id: String(userId) }),
      enabled: result.isSuccess,
    })),
  });

  const doctorMap = useMemo(() => {
    const map = new Map<number, DoctorProfile>();
    doctorResults.forEach((query, index) => {
      if (query.data?.data) {
        map.set(userIds[index], query.data.data);
      }
    });
    return map;
  }, [doctorResults, userIds]);

  const setDoctors = useBookAppointmentStore((s) => s.setDoctors);
  useEffect(() => {
    const doctors: Record<number, DoctorProfile> = {};
    doctorMap.forEach((doctor, userId) => {
      doctors[userId] = doctor;
    });
    setDoctors(doctors);
  }, [doctorMap, setDoctors]);

  const appointmentsWithDoctors = useMemo(
    () =>
      appointments.map((appointment) => ({
        ...appointment,
        doctor: doctorMap.get(appointment.userId),
      })),
    [appointments, doctorMap]
  );

  const isFetchingDoctors = doctorResults.some((q) => q.isFetching);

  return {
    ...result,
    appointments: appointmentsWithDoctors,
    isFetchingDoctors,
  };
};
