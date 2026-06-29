import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { DoctorProfile } from '../getSingleDoctor';

export const getDoctorProfile = async (): Promise<
  ApiResponse<DoctorProfile>
> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<DoctorProfile>>('/doctors/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetDoctorProfileQuery = ({
  enabled = true,
}: {
  enabled?: boolean;
}) => {
  const result = useQuery({
    queryKey: ['doctor', 'profile'],
    queryFn: getDoctorProfile,
    enabled,
  });

  return {
    ...result,
    doctorProfile: result.data?.data,
  };
};
