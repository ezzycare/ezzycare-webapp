import { ConsultationType } from '@/apiQuery/hospital/types';
import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface CreateAppointmentParams {
  userId: number;
  hospitalId?: number;
  myAppointment: 0 | 1;
  appointmentType: ConsultationType;
  urgent: 0 | 1;
  name: string;
  email: string;
  mobileNo: string;
  age: string;
  gender: Gender;
  reason: string;
  appointmentDate: string; // "YYYY-MM-DD"
  appointmentTime: string; // "hh:mm A"
  appointmentEndTime: string; // "hh:mm A"
  userServiceId: number;
  address: string;
  city: string;
  country: string;
  duration: number;
}

export interface Appointment {
  id: number;
  // ...fill in the rest of what the API returns for a created appointment
}

export const createAppointment = async (
  params: CreateAppointmentParams
): Promise<ApiResponse<Appointment>> => {
  try {
    const response = await axiosClient.post<ApiResponse<Appointment>>(
      '/healthcare/appointments',
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

export const useCreateAppointmentMutation = (
  options?: UseMutationOptions<
    ApiResponse<Appointment>,
    unknown,
    CreateAppointmentParams
  >
): UseMutationResult<
  ApiResponse<Appointment>,
  unknown,
  CreateAppointmentParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAppointment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['healthcare', 'appointments'],
      });
    },

    ...options,
  });
};
