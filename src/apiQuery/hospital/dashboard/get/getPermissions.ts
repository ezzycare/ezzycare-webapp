import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalPermissions = async (): Promise<
  ApiResponse<unknown>
> => {
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
      '/hospitals/permissions'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalPermissions = () => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'permissions'],
    queryFn: getHospitalPermissions,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
