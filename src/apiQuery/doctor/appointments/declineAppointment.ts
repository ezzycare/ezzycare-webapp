import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { DeclineAppointmentParams } from './types';

export const declineDoctorAppointment = async (
  params: DeclineAppointmentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/decline`,
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

export const useDeclineDoctorAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    DeclineAppointmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  DeclineAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineDoctorAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
