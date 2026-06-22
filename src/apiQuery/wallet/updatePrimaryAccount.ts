import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface DeleteBankAccountParams {
  id: number;
}

export const updatePrimaryAccount = async (
  params: DeleteBankAccountParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('Bank account id is required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/wallet/bank-accounts/${params.id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useUpdatePrimaryAccountMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    DeleteBankAccountParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  DeleteBankAccountParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePrimaryAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['wallet', 'bank-accounts'],
      });
    },

    ...options,
  });
};
