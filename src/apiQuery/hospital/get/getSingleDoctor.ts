import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface GetSingleDoctorPayload {
  doctorId: string;
}

export const getSingleDoctor = async ({
  doctorId,
}: GetSingleDoctorPayload): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
      `/hospitals/doctors/${doctorId}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetSingleDoctor = (doctorId: string) => {
  const result = useQuery<ApiResponse<unknown>, Error>({
    queryKey: ['hospitals', 'doctors', doctorId],
    queryFn: () => getSingleDoctor({ doctorId }),
    enabled: !!doctorId,
  });

  return {
    ...result,
    doctor: result.data?.data,
  };
};
