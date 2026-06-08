import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';

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
  page?: number;
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

export const getAppointments = async (
  params?: GetAppointmentsParams
): Promise<ApiResponse<GetAppointmentsResponse>> => {
  const response = await axiosClient.get<ApiResponse<GetAppointmentsResponse>>(
    `/healthcare/appointments`,
    { params }
  );
  return response.data;
};

export const useGetAppointmentsQuery = (
  params?: GetAppointmentsParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetAppointmentsResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<ApiResponse<GetAppointmentsResponse>, unknown> => {
  return useQuery({
    queryKey: ['healthcare', 'appointments', params],
    queryFn: () => getAppointments(params),
    ...options,
  });
};
