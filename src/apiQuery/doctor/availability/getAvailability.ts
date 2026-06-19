import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { axiosClient } from '@/services/axiosClient';
import type { DoctorAvailabilityResponse } from './types';

export const getDoctorAvailability =
  async (): Promise<DoctorAvailabilityResponse> => {
    try {
      const response = await axiosClient.get<DoctorAvailabilityResponse>(
        '/doctors/availability'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ?? error;
      }
      throw error;
    }
  };

export const useGetDoctorAvailabilityQuery = () => {
  const result = useQuery({
    queryKey: ['doctor', 'availability'],
    queryFn: getDoctorAvailability,
  });

  return {
    ...result,
    availability: result.data?.data,
  };
};
