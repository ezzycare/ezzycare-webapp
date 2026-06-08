import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

export interface CreateHospitalRoleParams {
  name: string;
  permissions: string[];
}
export const createHospitalRole = async (
  params: CreateHospitalRoleParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/roles',
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

export const useCreateHospitalRoleMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    CreateHospitalRoleParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  CreateHospitalRoleParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHospitalRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'roles'],
      });
    },

    ...options,
  });
};
