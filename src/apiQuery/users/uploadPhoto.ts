import { axiosClient } from '@/services/axiosClient';
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
} from '@tanstack/react-query';
import { ApiResponse } from '../types';

export interface UploadPhotoPayload {
  file: File;
}

export interface UploadPhotoResponse {
  url: string;
}

export const uploadPhoto = async (
  payload: UploadPhotoPayload
): Promise<ApiResponse<UploadPhotoResponse>> => {
  const formData = new FormData();
  formData.append('file', payload.file);

  const response = await axiosClient.post<ApiResponse<UploadPhotoResponse>>(
    `/users/upload-photo`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

export const useUploadPhotoMutation = (
  options?: UseMutationOptions<
    ApiResponse<UploadPhotoResponse>,
    unknown,
    UploadPhotoPayload
  >
): UseMutationResult<
  ApiResponse<UploadPhotoResponse>,
  unknown,
  UploadPhotoPayload
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPhoto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user', 'profile'],
      });
    },

    ...options,
  });
};
