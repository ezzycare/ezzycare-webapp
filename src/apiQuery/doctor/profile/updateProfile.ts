import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import type { UpdateDoctorProfilePayload } from './types';

export const updateDoctorProfile = async (
  payload: UpdateDoctorProfilePayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      '/doctors/update-bio',
      payload
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useUpdateDoctorProfileMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateDoctorProfilePayload
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateDoctorProfilePayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctorProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
    },

    ...options,
  });
};
