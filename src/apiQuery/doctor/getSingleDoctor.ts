import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { ConsultationType } from '../hospital/types';
import { Doctor } from './getDoctorDiscovery';

export interface GetDoctorParams {
  id: string;
}

export type Education = {
  id: string;
  userId: string;
  degreeName: string;
  collegeName: string;
  startYear: string;
  endYear: string;
  createdAt: string;
  updatedAt: string;
};

export type Experience = {
  id: string;
  userId: string;
  hospitalName: string;
  designation: string;
  startDate: string;
  endDate: string | null;
  isCurrent: number;
  totalExperience: string;
  createdAt: string;
  updatedAt: string;
};

export type ReviewUser = {
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

export type DoctorReview = {
  id: string;
  userId: string;
  clientId: string;
  appointmentId: string | null;
  orderId: string | null;
  rating: number;
  comment: string;
  status: 'ACTIVE' | 'INACTIVE';
  reviewDate: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
};

export type AvailabilitySlot = {
  id: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
};

export type Availability = {
  day: string;
  slots: AvailabilitySlot[];
};

export type Hospital = {
  id: string;
  hospitalName: string;
  profileImage: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  department: string | null;
  status: 'ACTIVE' | 'INACTIVE';
};

export type DoctorProfile = Doctor & {
  education: Education[];
  experience: Experience[];
  receivedReviews: DoctorReview[];
  subcategoryName: string;
  availability: Availability[];
  hospitals: Hospital[];
};

export type GetDoctorResponse = DoctorProfile;

export const getSingleDoctor = async (
  params: GetDoctorParams
): Promise<ApiResponse<GetDoctorResponse>> => {
  const response = await axiosClient.get<ApiResponse<GetDoctorResponse>>(
    `/doctors-discovery/${params.id}`
  );
  return response.data;
};

export const useGetSingleDoctorQuery = (
  params: GetDoctorParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetDoctorResponse>, unknown>,
    'queryKey' | 'queryFn'
  >
) => {
  const result = useQuery({
    queryKey: ['doctors-discovery', params.id],
    queryFn: () => getSingleDoctor(params),
    enabled: !!params.id,
    ...options,
  });

  return {
    ...result,
    doctor: result.data?.data,
  };
};
