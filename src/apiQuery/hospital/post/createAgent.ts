import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface CreateAgentPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const createHospitalAgent = async (
  params: CreateAgentPayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/agents',
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

/**
 * MUTATION HOOK (React Query v5)
 */
export const useCreateHospitalAgentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    CreateAgentPayload
  >
): UseMutationResult<ApiResponse<unknown>, unknown, CreateAgentPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHospitalAgent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'agents'],
      });
    },

    ...options,
  });
};
