import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface UpdateHospitalProfileParams {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const updateHospitalProfile = async (
  params: UpdateHospitalProfileParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      '/hospitals/profile',
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

export const useUpdateHospitalProfileMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateHospitalProfileParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateHospitalProfileParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHospitalProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'profile'],
      });
    },

    ...options,
  });
};
