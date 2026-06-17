import { axiosClient } from '@/services/axiosClient';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';
import { DoctorAppointmentStatsResponse } from './types';

export const getDoctorAppointmentStats =
  async (): Promise<DoctorAppointmentStatsResponse> => {
    try {
      const response = await axiosClient.get<DoctorAppointmentStatsResponse>(
        '/doctors/appointments/stats'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ?? error;
      }
      throw error;
    }
  };

export const useGetDoctorAppointmentStatsQuery = (
  options?: Omit<
    UseQueryOptions<DoctorAppointmentStatsResponse, unknown>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['doctor', 'appointments', 'stats'] as const,
    queryFn: getDoctorAppointmentStats,
    ...options,
  });

  return {
    ...result,
    stats: result.data?.data,
  };
};
