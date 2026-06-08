/* eslint-disable @typescript-eslint/no-explicit-any */

import type { LoginResponse } from '@/apiQuery/auth/types';
import axios from 'axios';
import { baseURL } from '../baseUrl';

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface SocialLoginPayload {
  provider: SocialProvider;
  accessToken?: string;
  idToken?: string;
}

export const socialLogin = async (
  payload: SocialLoginPayload
): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${baseURL}/auth/social-login`, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
