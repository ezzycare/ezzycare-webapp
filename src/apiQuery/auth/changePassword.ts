/* eslint-disable @typescript-eslint/no-explicit-any */

import { axiosClient } from '@/services/axiosClient';
import { baseURL } from '../baseUrl';

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload
): Promise<ChangePasswordResponse> => {
  try {
    const response = await axiosClient.post(
      `${baseURL}/auth/change-password`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
