import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import type { DeleteAvailabilitySlotParams } from './types';

export const deleteAvailabilitySlot = async (
  params: DeleteAvailabilitySlotParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.delete<ApiResponse<unknown>>(
      `/doctors/availability/${params.id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useDeleteAvailabilitySlotMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    DeleteAvailabilitySlotParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  DeleteAvailabilitySlotParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAvailabilitySlot,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'availability'] });
    },

    ...options,
  });
};
