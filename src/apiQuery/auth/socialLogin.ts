import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import type { LoginResponse } from '@/apiQuery/auth/types';
import { baseURL } from '../baseUrl';
import { ApiResponse } from '../types';

export const AUTH_QUERY_KEYS = {
  SOCIAL_LOGIN: ['auth', 'social-login'],
} as const;

export type SocialProvider = 'google' | 'apple' | 'facebook';

export interface SocialLoginPayload {
  provider: SocialProvider;
  accessToken?: string;
  idToken?: string;
}

export const socialLogin = async (
  payload: SocialLoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await axios.post<ApiResponse<LoginResponse>>(
    `${baseURL}/auth/social-login`,
    payload
  );

  return data;
};

export const useSocialLogin = () => {
  return useMutation<ApiResponse<LoginResponse>, unknown, SocialLoginPayload>({
    mutationKey: AUTH_QUERY_KEYS.SOCIAL_LOGIN,
    mutationFn: socialLogin,
  });
};
