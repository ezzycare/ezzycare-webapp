import { HospitalAppointmentsResponse } from '@/apiQuery/hospital/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalAppointments =
  async (): Promise<HospitalAppointmentsResponse> => {
    try {
      const response = await axiosClient.get<HospitalAppointmentsResponse>(
        '/hospitals/appointments'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ?? error;
      }

      throw error;
    }
  };

export const useGetHospitalAppointments = () => {
  const result = useQuery({
    queryKey: ['hospitals', 'appointments'],
    queryFn: getHospitalAppointments,
  });

  return {
    ...result,
    appointments: result.data?.data ?? [],
  };
};
