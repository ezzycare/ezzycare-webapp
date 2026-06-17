import { axiosClient } from '@/services/axiosClient';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { DoctorAppointmentResponse, GetDoctorAppointmentParams } from './types';

export const getDoctorAppointment = async (
  params: GetDoctorAppointmentParams
): Promise<DoctorAppointmentResponse> => {
  try {
    const response = await axiosClient.get<DoctorAppointmentResponse>(
      `/doctors/appointments/${params.id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetDoctorAppointmentQuery = (
  params: GetDoctorAppointmentParams,
  options?: Omit<
    UseQueryOptions<DoctorAppointmentResponse, unknown>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['doctor', 'appointments', params.id] as const,
    queryFn: () => getDoctorAppointment(params),
    enabled: params.id != null,
    ...options,
  });

  return {
    ...result,
    appointment: result.data?.data,
  };
};
