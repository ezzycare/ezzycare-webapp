import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { AcceptAppointmentParams } from './types';

export const acceptDoctorAppointment = async (
  params: AcceptAppointmentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/accept`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useAcceptDoctorAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AcceptAppointmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  AcceptAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptDoctorAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
