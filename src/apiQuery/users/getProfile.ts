import { User } from '@/apiQuery/auth/types';
import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getProfile = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await axiosClient.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetProfile = () => {
  const result = useQuery({
    queryKey: ['getProfile'],
    queryFn: getProfile,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
