import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AssignDoctorToAgentParams {
  agentId: string;
  doctorId: string;
}

/**
 * API FUNCTION
 */
export const assignDoctorToAgent = async (
  params: AssignDoctorToAgentParams
): Promise<ApiResponse<unknown>> => {
  if (!params.agentId) {
    throw new Error('agentId is required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/agents/${params.agentId}/assign-doctor`,
      { doctorId: params.doctorId }
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
export const useAssignDoctorToAgentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AssignDoctorToAgentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  AssignDoctorToAgentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDoctorToAgent,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'agents'],
      });

      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'doctors'],
      });
    },

    ...options,
  });
};
