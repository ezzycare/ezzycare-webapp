import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { CreateHospitalRoleParams } from '../post/createRoles';

interface UpdateHospitalRoleParams extends CreateHospitalRoleParams {
  roleId: number;
}

/**
 * API FUNCTION
 */
export const updateHospitalRole = async (
  params: UpdateHospitalRoleParams
): Promise<ApiResponse<unknown>> => {
  if (!params.roleId) {
    throw new Error('roleId is required');
  }

  const { roleId, ...body } = params;

  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      `/hospitals/roles/${roleId}`,
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
export const useUpdateHospitalRoleMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateHospitalRoleParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateHospitalRoleParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHospitalRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'roles'],
      });
    },

    ...options,
  });
};
