import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { AppointmentResponse } from './getAppointments';

export type AppointmentStatus =
  | 'PENDING'
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'PAID'
  | 'UNPAID'
  | 'COMPLETED'
  | 'CANCELLED';

export interface GetAppointmentParams {
  id: number;
}

export type GetSingleAppointmentResponse = AppointmentResponse;

export const getAppointment = async (
  params: GetAppointmentParams
): Promise<ApiResponse<GetSingleAppointmentResponse>> => {
  const response = await axiosClient.get<
    ApiResponse<GetSingleAppointmentResponse>
  >(`/healthcare/appointments/${params.id}`);
  return response.data;
};

export const useGetAppointmentQuery = (
  params: GetAppointmentParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetSingleAppointmentResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<ApiResponse<GetSingleAppointmentResponse>, unknown> => {
  return useQuery({
    queryKey: ['healthcare', 'appointments', params.id],
    queryFn: () => getAppointment(params),
    enabled: !!params.id,
    ...options,
  });
};
