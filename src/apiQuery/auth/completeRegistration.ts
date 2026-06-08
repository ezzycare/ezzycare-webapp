/* eslint-disable @typescript-eslint/no-explicit-any */

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export interface CompleteRegistrationPayload {
  categoryId: number;
  accountType: ACCOUNT_TYPE;
}

export interface CompleteRegistrationResponse {
  message: string;
  data?: {
    id: string;
    email: string;
    accountType: string;
    categoryId: number;
  };
}

export const completeRegistration = async (
  payload: CompleteRegistrationPayload
): Promise<CompleteRegistrationResponse> => {
  try {
    const response = await axios.post(
      `${baseURL}/auth/complete-registration`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
