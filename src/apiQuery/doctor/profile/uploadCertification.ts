import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import type { UploadCertificationPayload } from './types';

export const uploadDoctorCertification = async (
  params: UploadCertificationPayload
): Promise<ApiResponse<unknown>> => {
  const formData = new FormData();

  if (
    params.medicalCertificate instanceof File &&
    params.currentPracticeLicense instanceof File &&
    params.specialtyTrainingCertificate instanceof File
  ) {
    formData.append('medicalCertificate', params.medicalCertificate);
    formData.append('currentPracticeLicense', params.currentPracticeLicense);
    formData.append(
      'specialtyTrainingCertificate',
      params.specialtyTrainingCertificate
    );
  } else {
    throw new Error(
      'All files (medicalCertificate, currentPracticeLicense, specialtyTrainingCertificate) are required and must be of type File'
    );
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      '/doctors/upload-certification',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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

export const useUploadDoctorCertificationMutation = (
  options?: UseMutationOptions<
    ApiResponse<unknown>,
    unknown,
    UploadCertificationPayload
  >
): UseMutationResult<
  ApiResponse<unknown>,
  unknown,
  UploadCertificationPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadDoctorCertification,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
    },

    ...options,
  });
};
