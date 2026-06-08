import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { PayoutMethod } from '../types';

interface UpdateHospitalPayoutSettingsParams {
  payoutMethod: PayoutMethod;
  videoConsultationFee: number;
  clinicConsultationFee: number;
  homeConsultationFee: number;
  doctorPayoutPercentage: number;
}

export const updateHospitalPayoutSettings = async (
  params: UpdateHospitalPayoutSettingsParams
): Promise<ApiResponse<unknown>> => {
  try {
    const response = await axiosClient.put<ApiResponse<unknown>>(
      '/hospitals/payout-settings',
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

export const useUpdateHospitalPayoutSettingsMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UpdateHospitalPayoutSettingsParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UpdateHospitalPayoutSettingsParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHospitalPayoutSettings,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'payout-settings'],
      });
    },

    ...options,
  });
};
