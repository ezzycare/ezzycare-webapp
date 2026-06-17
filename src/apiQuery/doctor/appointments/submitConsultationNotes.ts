import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import { SubmitConsultationNotesParams } from './types';

export const submitDoctorConsultationNotes = async (
  params: SubmitConsultationNotesParams
): Promise<ApiResponse<unknown>> => {
  if (!params.id) {
    throw new Error('id is required');
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/doctors/appointments/${params.id}/consultation-notes`,
      {
        diagnostic: params.diagnostic,
        symptomsObserved: params.symptomsObserved,
        prescription: params.prescription,
        followUpInstructions: params.followUpInstructions,
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

export const useSubmitDoctorConsultationNotesMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    SubmitConsultationNotesParams
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  SubmitConsultationNotesParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitDoctorConsultationNotes,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['doctor', 'appointments'],
      });
    },

    ...options,
  });
};
