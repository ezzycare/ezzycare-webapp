import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import { DashboardResponse } from './types';

export const getHospitalDashboard = async (): Promise<DashboardResponse> => {
  try {
    const response = await axiosClient.get<DashboardResponse>(
      '/hospitals/dashboard'
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.data) {
      throw error.response.data;
    }

    throw error;
  }
};

export const useGetHospitalDashboard = () => {
  const result = useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard', 'hospital'],
    queryFn: getHospitalDashboard,
  });

  return {
    ...result,
    dashboard: result.data?.data ?? null,
  };
};
