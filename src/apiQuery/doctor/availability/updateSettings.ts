import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import type { UpdateAvailabilitySettingsPayload } from './types';

export const updateAvailabilitySettings = async (
  payload: UpdateAvailabilitySettingsPayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      '/doctors/availability/settings',
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

export const useUpdateAvailabilitySettingsMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateAvailabilitySettingsPayload
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateAvailabilitySettingsPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAvailabilitySettings,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'availability'] });
    },

    ...options,
  });
};
