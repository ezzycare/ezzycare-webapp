import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { CompleteAppointmentParams } from './types';

export const completeDoctorAppointment = async (
  params: CompleteAppointmentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/complete`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useCompleteDoctorAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    CompleteAppointmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  CompleteAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: completeDoctorAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
