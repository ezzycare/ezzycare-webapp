import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { User } from '@/apiQuery/auth/types';
import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { CreateAppointmentInterface } from '../post/createAppointment';

export interface GetAppointmentParams {
  id: number;
}

export interface GetSingleAppointmentType extends CreateAppointmentInterface {
  user: User;
  client: User;
  uid: number;
  seekerUid: number;
}

export const getAppointment = async (
  params: GetAppointmentParams
): Promise<ApiResponse<GetSingleAppointmentType>> => {
  const response = await axiosClient.get<ApiResponse<GetSingleAppointmentType>>(
    `/healthcare/appointments/${params.id}`
  );
  console.log({ response });
  return response.data;
};

export const useGetAppointmentQuery = (
  params: GetAppointmentParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetSingleAppointmentType>, unknown>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['healthcare', 'appointments', params.id],
    queryFn: () => getAppointment(params),
    enabled: params.id != null,
    ...options,
  });

  const appointment = result.data?.data;

  console.log({ result });
  return {
    ...result,
    appointment,
  };
};
