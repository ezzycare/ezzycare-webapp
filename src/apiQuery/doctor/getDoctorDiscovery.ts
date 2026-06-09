import {
  useInfiniteQuery,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { ConsultationType } from '../hospital/types';

export type DoctorSortBy = 'distance' | 'rating';

export interface GetDoctorsDiscoveryParams {
  categoryId?: number;
  type?: ConsultationType;
  search?: string;
  rating?: number;
  countryId?: number;
  latitude?: number;
  longitude?: number;
  distance?: number;
  hospitalId?: string;
  sortBy?: DoctorSortBy;
  page?: number;
  limit?: number;
}

export type Review = {
  rating: number;
};

export type DoctorUserDetails = {
  id: string;
  userId: string;
  clinicHospitalName: string | null;
  aboutUs: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  pincode: string | null;
  emergencyContact: string | null;
  emergencyContactName: string | null;
  dob: string | null;
  maritalStatus: string | null;
  bloodGroup: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  smokingHabbits: string | null;
  alcoholConsumption: string | null;
  foodPreference: string | null;
  occupation: string | null;
  normalFees: number | null;
  urgentFees: number | null;
  homeVisitFees: number | null;
  deliveryCharge: number | null;
  urgent: number;
  availability: string | null;
  registrationNo: string | null;
  registrationCouncil: string | null;
  registrationYear: string | null;
  clinicName: string | null;
  clinicCity: string | null;
  clinicLocality: string | null;
  clinicPlace: string | null;
  clinicState: string | null;
  clinicCountry: string | null;
  qualificationCertificate: string | null;
  practicingLicence: string | null;
  healthFacilityCertificate: string | null;
  regstrationCertificate: string | null;
  pharmacistCertificate: string | null;
  proofOfAddress: string | null;
  qualificationCertStatus: number | null;
  practicingLicenceStatus: number | null;
  healthFacilityCertStatus: number | null;
  regstrationCertStatus: number | null;
  pharmacistCertStatus: number | null;
  totalExperienceYear: string | null;
  sameTiming: boolean | null;
  feesMinute: number | null;
  feesHour: number | null;
  feesDay: number | null;
  activityLevel: string | null;
  currentMedications: string | null;
  pastMedications: string | null;
  chronicDisease: string | null;
  injuries: string | null;
  surgeries: string | null;
  practicingLicenceDate: string | null;
  urgentCriteria: string | null;
  clinicConsultationCharge: number | null;
  homeConsultationCharge: number | null;
  videoConsultationCharge: number | null;
  nursingFacilityChargeFullDay: number | null;
  nursingHomeVisitChargeFullDay: number | null;
  addressType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Doctor = {
  id: string;
  categoryId: string;
  subcategoryId: string;
  ezzycareCard: string | null;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt: string | null;
  countryCode: string | null;
  mobileNo: string;
  mobileVerifiedAt: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  profileImage: string | null;
  deviceType: string | null;
  deviceUuid: string | null;
  deviceToken: string | null;
  socialType: string | null;
  facebookId: string | null;
  googleId: string | null;
  appleId: string | null;
  latitude: number;
  longitude: number;
  walletBalance: number;
  lockWalletBalance: number;
  status: 'ACTIVE' | 'INACTIVE';
  notificationStatus: number;
  approvedDate: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  userTimezone: string | null;
  userIp: string | null;
  completedPercentage: number;
  welcomeBonus: number;
  registerType: string | null;
  tokenVersion: number;
  accountType: string;
  employerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hospitalRoleId: string | null;
  userDetails: DoctorUserDetails;
  receivedReviews: Review[];
  account_type: string;
  account_type_label: string;
  profileCompleted: boolean;
  rating: number;
  reviewCount: number;
  distance: number | null;
  clinicConsultationCharge: number | null;
  videoConsultationCharge: number | null;
  homeConsultationCharge: number | null;
  feesMinute: number | null;
  feesHour: number | null;
};

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetDoctorsDiscoveryResponse {
  items: Doctor[];
  meta: PaginationMeta;
}

export const getDoctorsDiscovery = async (
  params?: GetDoctorsDiscoveryParams
): Promise<ApiResponse<GetDoctorsDiscoveryResponse>> => {
  const response = await axiosClient.get<
    ApiResponse<GetDoctorsDiscoveryResponse>
  >(`/doctors-discovery`, { params });
  return response.data;
};

export const useGetDoctorsDiscoveryQuery = (
  params?: Omit<GetDoctorsDiscoveryParams, 'page'>,
  options?: Omit<
    UseInfiniteQueryOptions<
      ApiResponse<GetDoctorsDiscoveryResponse>,
      unknown,
      InfiniteData<ApiResponse<GetDoctorsDiscoveryResponse>>,
      readonly unknown[],
      number
    >,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
  >
) => {
  const result = useInfiniteQuery({
    queryKey: ['doctors-discovery', 'infinite', params],
    queryFn: ({ pageParam }) =>
      getDoctorsDiscovery({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.data?.meta;
      return meta?.hasNextPage ? meta?.page + 1 : undefined;
    },
    ...options,
  });

  const doctors = result.data?.pages.flatMap((page) => page.data?.items) ?? [];

  return {
    ...result,
    doctors,
  };
};
