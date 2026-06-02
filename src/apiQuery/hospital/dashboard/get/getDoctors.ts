import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalDoctors = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<unknown>>('/hospitals/doctors');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalDoctors = () => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'doctors'],
    queryFn: getHospitalDoctors,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
