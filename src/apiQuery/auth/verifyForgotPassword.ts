/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from 'axios';
import { baseURL } from '../baseUrl';

export interface VerifyForgotPasswordOtpPayload {
  email: string;
  code: string;
}

export interface VerifyForgotPasswordOtpResponse {
  message: string;
  data?: {
    resetToken: string;
  };
}

export const verifyForgotPasswordOtp = async (
  payload: VerifyForgotPasswordOtpPayload
): Promise<VerifyForgotPasswordOtpResponse> => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/verify-forgot-password-otp`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
