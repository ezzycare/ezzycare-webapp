/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';
import axios from 'axios';
import { baseURL } from '../baseUrl';
import { ACCOUNT_TYPE } from './types';

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo?: string;
  password: string;
  latitude?: number;
  longitude?: number;
  accountType: ACCOUNT_TYPE;
  hospitalName?: string;
}

export interface SignupResponse {
  message: string;
  data?: {
    id: string;
    email: string;
    accountType: string;
  };
}

export const signup = async (
  payload: SignupPayload
): Promise<SignupResponse> => {
  try {
    const response = await axios.post(`${baseURL}/auth/register`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const useSignUpMutation = (
  options?: UseMutationOptions<SignupResponse, unknown, SignupPayload>
): UseMutationResult<SignupResponse, unknown, SignupPayload> => {
  return useMutation({
    mutationFn: signup,
    ...options,
  });
};
