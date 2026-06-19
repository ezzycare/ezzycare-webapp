import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';

export interface AcceptHospitalInvitationParams {
  id: string;
}

export const acceptHospitalInvitation = async (
  params: AcceptHospitalInvitationParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.patch<ApiResponse<unknown>>(
      `/doctors/hospital-invitations/${params.id}/accept`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useAcceptHospitalInvitationMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AcceptHospitalInvitationParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  AcceptHospitalInvitationParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptHospitalInvitation,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'hospital-invitations'],
      });
    },

    ...options,
  });
};
