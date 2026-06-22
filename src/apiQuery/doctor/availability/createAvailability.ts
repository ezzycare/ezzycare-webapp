import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { axiosClient } from '@/services/axiosClient';
import type { AvailabilitySlot, CreateAvailabilitySlotPayload } from './types';

export const createAvailabilitySlot = async (
  payload: CreateAvailabilitySlotPayload
): Promise<{
  success: boolean;
  message: string;
  data: AvailabilitySlot | null;
}> => {
  try {
    const response = await axiosClient.post<{
      success: boolean;
      message: string;
      data: AvailabilitySlot | null;
    }>('/doctors/availability', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useCreateAvailabilitySlotMutation = (
  options?: UseMutationOptions<
    { success: boolean; message: string; data: AvailabilitySlot | null },
    unknown,
    CreateAvailabilitySlotPayload
  >
): UseMutationResult<
  { success: boolean; message: string; data: AvailabilitySlot | null },
  unknown,
  CreateAvailabilitySlotPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAvailabilitySlot,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'availability'] });
    },

    ...options,
  });
};
