import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface AssignDoctorToDepartmentParams {
  departmentId: number;
  doctorId: number;
}

export const updateHospitalProfile = async (
  params: AssignDoctorToDepartmentParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      `/hospitals/doctors/${params.doctorId}/department`,
      {
        departmentId: params.departmentId,
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

export const useAssignDoctorToDepartmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    AssignDoctorToDepartmentParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  AssignDoctorToDepartmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHospitalProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'doctors'],
      });
    },

    ...options,
  });
};
