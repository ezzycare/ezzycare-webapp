import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentStatus } from '../get/getAppointments';

export interface UpdateAppointmentStatusParams {
  id: number;
  status: AppointmentStatus;
  cancelReason?: string;
}

export interface UpdateAppointmentStatusResponse {
  success: boolean;
  message: string;
}

export const updateAppointmentStatus = async (
  params: UpdateAppointmentStatusParams
): Promise<ApiResponse<UpdateAppointmentStatusResponse>> => {
  const response = await axiosClient.put<
    ApiResponse<UpdateAppointmentStatusResponse>
  >(`/api/healthcare/appointments/${params.id}/status`, {
    status: params.status,
    cancelReason: params.cancelReason,
  });

  return response.data;
};

export const useUpdateAppointmentStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: UpdateAppointmentStatusParams) =>
      updateAppointmentStatus(params),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },
  });
};
