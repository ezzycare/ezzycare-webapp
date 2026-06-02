import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface InviteDoctorPayload {
  fullName: string;
  email: string;
  phone: string; //"+234800000000"
  frontendUrl: string; // https://frontend.com/accept-invite
}

export const inviteDoctor = async (
  params: InviteDoctorPayload
): Promise<ApiResponse<unknown>> => {
  if (
    !params.fullName ||
    !params.email ||
    !params.phone ||
    !params.frontendUrl
  ) {
    throw new Error('All fields are required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/doctors/invite`,
      {
        fullName: params.fullName,
        email: params.email,
        phone: params.phone,
        frontendUrl: params.frontendUrl,
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

export const useInviteDoctorMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    InviteDoctorPayload
  >
): UseMutationResult<ApiResponse<unknown>, unknown, InviteDoctorPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: inviteDoctor,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'doctors'],
      });
    },

    ...options,
  });
};
