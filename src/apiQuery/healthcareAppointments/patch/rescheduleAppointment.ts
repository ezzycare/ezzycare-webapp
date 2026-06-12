import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface RescheduleAppointmentParams {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
}

export interface RescheduleAppointmentResponse {
  success: boolean;
  message: string;
}

export const rescheduleAppointment = async (
  params: RescheduleAppointmentParams
): Promise<ApiResponse<RescheduleAppointmentResponse>> => {
  const response = await axiosClient.patch<
    ApiResponse<RescheduleAppointmentResponse>
  >(`/api/healthcare/appointments/${params.id}/reschedule`, {
    appointmentDate: params.appointmentDate,
    appointmentTime: params.appointmentTime,
    appointmentEndTime: params.appointmentEndTime,
  });

  return response.data;
};

export const useRescheduleAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: RescheduleAppointmentParams) =>
      rescheduleAppointment(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },
  });
};
