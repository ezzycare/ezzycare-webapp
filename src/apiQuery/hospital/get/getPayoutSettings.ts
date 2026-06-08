import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getHospitalPayoutSettings = async (): Promise<
  ApiResponse<unknown>
> => {
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
      '/hospitals/payout-settings'
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalPayoutSettings = () => {
  const result = useQuery({
    queryKey: ['hospitals', 'payout-settings'],
    queryFn: getHospitalPayoutSettings,
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
