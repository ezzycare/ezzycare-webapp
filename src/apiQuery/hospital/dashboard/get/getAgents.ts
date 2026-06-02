import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalAgents = async (): Promise<ApiResponse<unknown>> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<unknown>>('/hospitals/agents');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalAgents = () => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'agents'],
    queryFn: getHospitalAgents,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
