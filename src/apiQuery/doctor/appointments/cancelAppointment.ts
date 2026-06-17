import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { CancelAppointmentParams } from './types';

export const cancelDoctorAppointment = async (
  params: CancelAppointmentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/cancel`,
      { reason: params.reason }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useCancelDoctorAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    CancelAppointmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  CancelAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelDoctorAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
