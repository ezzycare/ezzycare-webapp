import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AddServiceParams {
  serviceId: number;
}
export const addServiceToHospital = async (
  params: AddServiceParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/services',
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

export const useAddServiceMutation = (
  options?: UseMutationOptions<ApiResponse<unknown>, unknown, AddServiceParams>
): UseMutationResult<ApiResponse<unknown>, unknown, AddServiceParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addServiceToHospital,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'services'],
      });
    },

    ...options,
  });
};
