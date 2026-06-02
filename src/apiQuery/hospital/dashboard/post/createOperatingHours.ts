import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { ConsultationType } from '../types';

export interface CreateOperatingHoursPayload {
  hours: {
    day: string; // "Monday",
    startTime: string;
    endTime: string;
    consultationType: ConsultationType;
  }[];
}
export const createHospitalOperatingHours = async (
  params: CreateOperatingHoursPayload
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/hospitals/operating-hours',
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

export const useCreateHospitalOperatingHoursMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    CreateOperatingHoursPayload
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  CreateOperatingHoursPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHospitalOperatingHours,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'operating-hours'],
      });
    },

    ...options,
  });
};
