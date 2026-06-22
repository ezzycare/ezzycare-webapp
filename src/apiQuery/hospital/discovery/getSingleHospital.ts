import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface GetSingleHospitalPayload {
  id: number | null;
}

export interface HospitalContact {
  email: string;
  mobileNo: string;
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface HospitalDoctorBrief {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  clinicConsultationCharge: number;
  videoConsultationCharge: number;
}

export interface HospitalProfileType {
  id: number;
  hospitalName: string;
  profileImage: string | null;
  rating: number;
  totalDoctors: number;
  aboutUs: string;
  contact: HospitalContact;
  services: unknown[];
  timeAvailability: unknown[];
  doctors: HospitalDoctorBrief[];
}

export const getSingleHospital = async ({
  id,
}: GetSingleHospitalPayload): Promise<ApiResponse<HospitalProfileType>> => {
  try {
    const response = await axiosClient.get<ApiResponse<HospitalProfileType>>(
      `/hospitals-discovery/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetSingleHospital = (params: GetSingleHospitalPayload) => {
  const result = useQuery<ApiResponse<HospitalProfileType>, Error>({
    queryKey: ['hospitals', params.id],
    queryFn: () => getSingleHospital({ id: params.id }),
    enabled: !!params?.id,
  });

  return {
    ...result,
    hospital: result.data?.data,
  };
};
