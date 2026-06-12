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

export interface CreateAppointmentInterfaceParams {
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
  userServiceId?: number;
  address: string;
  city: string;
  country: string;
  duration: number;
}

export interface CreateAppointmentInterface {
  id: number;
  userId: string;
  clientId: string;
  hospitalId: string | null;
  appointmentType: ConsultationType;
  urgent: number;
  name: string;
  email: string;
  mobileNo: string;
  age: string;
  gender: 'MALE' | 'FEMALE';
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentPrice: number;
  otpCode: string | null;
  cancelReason: string | null;
  cancelDate: string | null;
  cancelUserId: string | null;
  status: 'PENDING' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED' | string;
  transactionId: string | null;
  consultNotes: string | null;
  userRating: number | null;
  userReview: string | null;
  userServiceId: string | null;
  completedDatetime: string | null;
  voucherCodeId: string | null;
  voucherAmount: number | null;
  hcpFees: number | null;
  homeVisitFees: number | null;
  totalCharge: number;
  fullDay: boolean | null;
  address: string;
  city: string;
  country: string;
  myAppointment: number;
  videoStartTime: string | null;
  videoEndTime: string | null;
  longitude: number | null;
  latitude: number | null;
  acceptedDate: string | null;
  appointmentEndDate: string | null;
  appointmentEndTime: string;
  startDatetime: string | null;
  voucherCodeType: string | null;
  isHappyClients: boolean | null;
  roomName: string | null;
  doctorToken: string | null;
  seekerToken: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const createAppointment = async (
  params: CreateAppointmentInterfaceParams
): Promise<ApiResponse<CreateAppointmentInterface>> => {
  try {
    const response = await axiosClient.post<
      ApiResponse<CreateAppointmentInterface>
    >('/healthcare/appointments', params);

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
    ApiResponse<CreateAppointmentInterface>,
    unknown,
    CreateAppointmentInterfaceParams
  >
): UseMutationResult<
  ApiResponse<CreateAppointmentInterface>,
  unknown,
  CreateAppointmentInterfaceParams
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
