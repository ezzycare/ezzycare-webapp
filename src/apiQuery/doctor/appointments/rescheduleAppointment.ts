import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { RescheduleAppointmentParams } from './types';

export const rescheduleDoctorAppointment = async (
  params: RescheduleAppointmentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/reschedule`,
      {
        appointmentDate: params.appointmentDate,
        appointmentTime: params.appointmentTime,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useRescheduleDoctorAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    RescheduleAppointmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  RescheduleAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rescheduleDoctorAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
