/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  LoginType,
  SendOtpRequestPropsType,
  VerifyOtpRequestPropsType,
} from '@/apiQuery/auth/types';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export const login = async (credentials: LoginType) => {
  try {
    const response = await axios.post(`${baseURL}/auth/login`, credentials);
    return response.data;
  } catch (error: any) {
    console.log({ error: error?.response?.data?.message });
    return error;
  }
};

export const sendOtp = async (credentials: SendOtpRequestPropsType) => {
  try {
    const response = await axios.post(`${baseURL}/auth/otp/send`, credentials);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyOtp = async (credentials: VerifyOtpRequestPropsType) => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/otp/verify`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const refreshToken = async ({ token }: { token: string }) => {
  try {
    const response = await axios.post(`${baseURL}/auth/refreshtoken`, {
      refreshToken: token,
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
