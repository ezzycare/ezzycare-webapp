import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalSystemServices = async (): Promise<
  ApiResponse<unknown>
> => {
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
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
    user: result.data?.data,
  };
};
