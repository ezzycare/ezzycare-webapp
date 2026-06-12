import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface CancelAppointmentParams {
  id: number;
  reason: string;
}

export interface CancelAppointmentResponse {
  success: boolean;
  message: string;
}

export const cancelAppointment = async (
  params: CancelAppointmentParams
): Promise<ApiResponse<CancelAppointmentResponse>> => {
  const response = await axiosClient.patch<
    ApiResponse<CancelAppointmentResponse>
  >(`/healthcare/appointments/${params.id}/cancel`, {
    reason: params.reason,
  });

  return response.data;
};

export const useCancelAppointmentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CancelAppointmentParams) => cancelAppointment(params),

    onSuccess: () => {
      // optional: refresh appointments list
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },
  });
};
