import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AcceptInviteParams {
  token: string;
}

export const acceptTeamInvite = async (
  params: AcceptInviteParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/team/accept-invite',
      params
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useAcceptTeamInviteMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AcceptInviteParams
  >
): UseMutationResult<ApiResponse<unknown>, unknown, AcceptInviteParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptTeamInvite,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'team'],
      });
    },

    ...options,
  });
};
