import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface UpdateHospitalTeamRoleParams {
  userId: string;
  roleId: number;
}

export const updateHospitalTeamRole = async (
  params: UpdateHospitalTeamRoleParams
): Promise<ApiResponse<unknown>> => {
  if (!params.userId) {
    throw new Error('userId is required');
  }

  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      `/hospitals/team/${params.userId}/role`,
      {
        roleId: params.roleId,
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

export const useUpdateHospitalTeamRoleMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateHospitalTeamRoleParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateHospitalTeamRoleParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHospitalTeamRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'team'],
      });

      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'roles'],
      });
    },

    ...options,
  });
};
