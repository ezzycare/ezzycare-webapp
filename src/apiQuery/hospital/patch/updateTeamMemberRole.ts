import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface UpdateTeamMemberRoleParams {
  userId: string;
  roleId: number;
}

/**
 * API FUNCTION
 */
export const updateTeamMemberRole = async (
  params: UpdateTeamMemberRoleParams
): Promise<ApiResponse<unknown>> => {
  if (!params.userId) {
    throw new Error('userId is required');
  }

  const { userId, ...body } = params;

  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      `/hospitals/team/${userId}/role`,
      body
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

/**
 * MUTATION HOOK (React Query v5)
 */
export const useUpdateTeamMemberRoleMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateTeamMemberRoleParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateTeamMemberRoleParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeamMemberRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'team'],
      });
    },

    ...options,
  });
};
