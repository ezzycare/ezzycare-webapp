import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AssignDoctorPayload {
  doctorId: string;
}

export const assignDoctor = async (
  params: AssignDoctorPayload
): Promise<ApiResponse<unknown>> => {
  if (!params.doctorId) {
    throw new Error('doctorId is required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/doctors/assign`,
      {
        doctorId: params.doctorId,
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

export const useAssignDoctorMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AssignDoctorPayload
  >
): UseMutationResult<ApiResponse<unknown>, unknown, AssignDoctorPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignDoctor,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'doctors'],
      });
    },

    ...options,
  });
};
