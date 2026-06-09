import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface DeleteHospitalRoleParams {
  roleId: number;
}

export const deleteHospitalRole = async (
  params: DeleteHospitalRoleParams
): Promise<ApiResponse<unknown>> => {
  if (!params.roleId) {
    throw new Error('roleId is required');
  }

  try {
    const response = await axiosClient.delete<ApiResponse<unknown>>(
      `/hospitals/roles/${params.roleId}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useDeleteHospitalRoleMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    DeleteHospitalRoleParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  DeleteHospitalRoleParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHospitalRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'roles'],
      });
    },

    ...options,
  });
};
