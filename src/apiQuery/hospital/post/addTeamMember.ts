import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AddTeamMemberPayload {
  fullName: string;
  email: string;
  roleId: number;
  frontendUrl: string; // https://frontend.com/accept-invite
}
export const addTeamMember = async (
  params: AddTeamMemberPayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/team',
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

export const useAddTeamMemberMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AddTeamMemberPayload
  >
): UseMutationResult<ApiResponse<unknown>, unknown, AddTeamMemberPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTeamMember,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'team'],
      });
    },

    ...options,
  });
};
