import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { ApiResponse } from '../types';

export type Gender = 'MALE' | 'FEMALE';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  gender?: Gender;
  countryCode?: string;
  mobileNo?: string;
  subcategoryId?: number; // TODO: confirm — API doc shows `{}`, likely number or number[]
  bloodGroup?: string;
  maritalStatus?: string;
  height?: string;
  weight?: string;
  emergencyContactName?: string;
  emergencyContact?: string;
  allergies?: string[];
  currentMedications?: string[];
  pastMedications?: string[];
  chronicDisease?: string[];
  injuries?: string[];
  surgeries?: string[];
  country?: string;
  city?: string;
  address?: string;
  pincode?: string;
  dob?: string; // ISO 8601 date, e.g. "1990-01-15"
  aboutUs?: string;
  smokingHabbits?: string; // sic — API typo
  alcoholConsumption?: string;
  foodPreference?: string;
  activityLevel?: string;
  occupation?: string;
  totalExperienceYear?: string;
  isCompleted?: boolean;
}

export interface UpdateProfileResponse {
  id: string;
}

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<ApiResponse<UpdateProfileResponse>> => {
  const response = await axiosClient.patch<ApiResponse<UpdateProfileResponse>>(
    `/users/profile`,
    payload
  );
  return response.data;
};

export const useUpdateProfileMutation = (
  options?: UseMutationOptions<
    ApiResponse<UpdateProfileResponse>,
    unknown,
    UpdateProfilePayload
  >
): UseMutationResult<
  ApiResponse<UpdateProfileResponse>,
  unknown,
  UpdateProfilePayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile'],
      });
    },

    ...options,
  });
};
