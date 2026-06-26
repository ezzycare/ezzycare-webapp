'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { useSocialLogin } from '@/apiQuery/auth/socialLogin';
import { LoginResponse } from '@/apiQuery/auth/types';
import { toaster } from '@/lib/toaster';
import { socialLoginAction } from '@/serverActions/socialLogin';
import { AuthStore, useAuthStore } from '@/stores/authStore';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { mutate: socialLogin } = useSocialLogin();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const error = params.get('error');

    if (error || !accessToken || !idToken) {
      return;
    }

    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'GOOGLE_OAUTH_CALLBACK',
          accessToken,
          idToken,
          error,
        },
        window.location.origin
      );
      window.close();
      return;
    }

    socialLogin(
      { provider: 'google', accessToken, idToken },
      {
        onSuccess: async (data) => {
          const response = data?.data;
          await handleLoginResponse(response ?? null, authStore, router);
        },
        onError: () => {
          router.push('/auth/signin');
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

async function handleLoginResponse(
  response: LoginResponse | null,
  authStore: AuthStore,
  router: ReturnType<typeof useRouter>
) {
  if (!response?.data) {
    router.push('/auth/signin');
    return;
  }
  if (!response.data.email_verified) {
    router.push(
      '/auth/verify-email?type=signin&email=' + response.data.user?.email
    );
    return;
  }
  await socialLoginAction(response);
  authStore.updateUser(response.data.user);
  authStore.setToken(response.data.access_token);
  toaster.success('Login successful');
  router.push('/dashboard');
}
