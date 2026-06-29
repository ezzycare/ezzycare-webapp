import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';

interface UploadCertificationPayload {
  cac?: File;
  license?: File;
  permit?: File;
  proofOfAddress?: File;
}

export const uploadCertification = async (
  params: UploadCertificationPayload
): Promise<ApiResponse<unknown>> => {
  const formData = new FormData();

  if (
    params.cac &&
    params.license &&
    params.permit &&
    params.proofOfAddress &&
    Object.values(params).every((file) => file instanceof File)
  ) {
    formData.append('cac', params.cac);
    formData.append('license', params.license);
    formData.append('permit', params.permit);
    formData.append('proofOfAddress', params.proofOfAddress);
  } else {
    throw new Error(
      'All files (cac, license, permit, proofOfAddress) are required and must be of type File'
    );
  }

  try {
    const response = await axiosClient.post<ApiResponse<unknown>>(
      `/hospitals/upload-certification`,
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

export const useUploadHospitalCertificationMutation = (
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
    mutationFn: uploadCertification,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['hospitals', 'profile'],
      });
    },

    ...options,
  });
};
