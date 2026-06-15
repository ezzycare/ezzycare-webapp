import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface SystemService {
  id: string;
  serviceName: string;
  serviceType: number;
  status: string;
}

export const getHospitalSystemServices = async (): Promise<
  ApiResponse<SystemService[]>
> => {
  try {
    const response = await axiosClient.get<ApiResponse<SystemService[]>>(
      '/hospitals/system-services'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalSystemServices = () => {
  const result = useQuery({
    queryKey: ['hospitals', 'system-services'],
    queryFn: getHospitalSystemServices,
  });

  return {
    ...result,
    services: result.data?.data,
  };
};
