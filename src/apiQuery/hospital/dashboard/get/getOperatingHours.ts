import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalOperatingHours = async (): Promise<
  ApiResponse<unknown>
> => {
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
      '/hospitals/operating-hours'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalOperatingHours = () => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'operating-hours'],
    queryFn: getHospitalOperatingHours,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
