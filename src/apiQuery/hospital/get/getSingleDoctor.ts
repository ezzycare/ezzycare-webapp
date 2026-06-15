import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface GetSingleDoctorPayload {
  doctorId: string;
}

export interface DoctorSummary {
  totalDoctors: number;
  totalAssigned: number;
  totalUnassigned: number;
}

export interface HospitalDoctorData {
  summary: DoctorSummary;
  doctors: unknown[];
}

export const getSingleDoctor = async ({
  doctorId,
}: GetSingleDoctorPayload): Promise<ApiResponse<HospitalDoctorData>> => {
  try {
    const response = await axiosClient.get<ApiResponse<HospitalDoctorData>>(
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
  const result = useQuery<ApiResponse<HospitalDoctorData>, Error>({
    queryKey: ['hospitals', 'doctors', doctorId],
    queryFn: () => getSingleDoctor({ doctorId }),
    enabled: !!doctorId,
  });

  return {
    ...result,
    doctor: result.data?.data,
  };
};
