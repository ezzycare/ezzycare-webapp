/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  LoginResponse,
  LoginType,
  ReSendOtpRequestProps,
} from '@/apiQuery/auth/types';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export const login = async (credentials: LoginType): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    // console.log({ error: error?.response?.data?.message });
    return error;
  }
};

export const resendOtp = async (credentials: ReSendOtpRequestProps) => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/resend-otp`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
