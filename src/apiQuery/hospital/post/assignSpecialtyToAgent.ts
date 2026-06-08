import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AssignSpecialtyParams {
  agentId: string;
  categoryId?: string;
}

export const assignSpecialtyToAgent = async (
  params: AssignSpecialtyParams
): Promise<ApiResponse<unknown>> => {
  if (!params.agentId) {
    throw new Error('agentId is required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/agents/${params.agentId}/assign-specialty`,
      {
        categoryId: params.categoryId,
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

export const useAssignSpecialtyToAgentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AssignSpecialtyParams
  >
): UseMutationResult<ApiResponse<unknown>, unknown, AssignSpecialtyParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignSpecialtyToAgent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'agents'],
      });

      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'specialties'],
      });
    },

    ...options,
  });
};
