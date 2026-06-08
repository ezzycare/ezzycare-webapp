import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalRoles = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<unknown>>('/hospitals/roles');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalRoles = () => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'roles'],
    queryFn: getHospitalRoles,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
