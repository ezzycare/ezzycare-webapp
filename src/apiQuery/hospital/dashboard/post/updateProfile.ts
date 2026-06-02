import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface UpdateProfilePayload {
  profileImage: File;
  aboutUs: string;
  clinicHospitalName: string;
  address: string;
  city: string;
  clinicState: string;
  country: string;
  services: string[];
}

export const updateProfile = async (
  params: UpdateProfilePayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/profile`,
      params
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useUpdateProfileMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateProfilePayload
  >
): UseMutationResult<ApiResponse<unknown>, unknown, UpdateProfilePayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'profile'],
      });
    },

    ...options,
  });
};
