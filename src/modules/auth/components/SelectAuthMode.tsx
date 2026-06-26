'use client';

import { ArrowRight, Mail } from 'lucide-react';
import { useRef } from 'react';

import { useSocialLogin } from '@/apiQuery/auth/socialLogin';
import { LoginResponse } from '@/apiQuery/auth/types';
import Card from '@/components/Ui/Card';
import { useAppleLogin } from '@/hooks/useAppleLogin';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { socialLoginAction } from '@/serverActions/socialLogin';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

const hasGoogleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== '';
const hasFacebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID !== '';
const hasAppleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID !== '';

export default function SelectAuthMode({ action }: { action: () => void }) {
  const router = useRouter();
  const authStore = useAuthStore((state: AuthStore) => state);

  const { mutate: socialLogin, isPending } = useSocialLogin();

  const completeLogin = async (response: LoginResponse | null) => {
    if (response?.data) {
      if (!response.data?.email_verified) {
        router.push(
          '/auth/verify-email?type=signin&email=' + response.data?.user?.email
        );
        return;
      }
      await socialLoginAction(response);
      authStore.updateUser(response.data?.user);
      authStore.setToken(response.data.access_token);
      toaster.success('Login successful');
      router.push('/dashboard');
    }
  };

  const facebookLogin = useFacebookLogin();
  const appleLogin = useAppleLogin();
  const messageHandlerRef = useRef<((e: MessageEvent) => void) | null>(null);

  const handleGoogleSignin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const redirectUri = `${appUrl}/auth/google-callback`;

    if (!clientId) return;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token token',
      scope: 'openid profile email',
      nonce: crypto.randomUUID(),
      prompt: 'select_account',
    });

    const popup = window.open(
      `${GOOGLE_OAUTH_URL}?${params.toString()}`,
      'google-oauth-popup',
      `width=500,height=600`
    );

    if (!popup) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'GOOGLE_OAUTH_CALLBACK') return;

      if (messageHandlerRef.current) {
        window.removeEventListener('message', messageHandlerRef.current);
        messageHandlerRef.current = null;
      }

      if (e.data.error) {
        console.error('Google OAuth error:', e.data.error);
        return;
      }

      if (e.data.accessToken && e.data.idToken) {
        socialLogin(
          {
            provider: 'google',
            accessToken: e.data.accessToken,
            idToken: e.data.idToken,
          },
          {
            onSuccess: (data) => {
              completeLogin(data?.data);
              action();
            },
            onError: () => {
              console.error('Google backend auth failed');
            },
          }
        );
      }
    };

    if (messageHandlerRef.current) {
      window.removeEventListener('message', messageHandlerRef.current);
    }
    messageHandlerRef.current = handleMessage;
    window.addEventListener('message', handleMessage);
  };

  const handleFacebookSignin = () => {
    facebookLogin({
      onSuccess: (tokenResponse) => {
        socialLogin(
          {
            provider: 'facebook',
            accessToken: tokenResponse.accessToken,
            idToken: '',
          },
          {
            onSuccess: (data) => {
              completeLogin(data?.data);
              action();
            },
            onError: () => {
              console.error('Facebook backend auth failed');
            },
          }
        );
      },
      onError: (error) => {
        console.error('Facebook Login Failed:', error.message);
      },
    });
  };

  const handleAppleSignin = () => {
    appleLogin({
      onSuccess: (tokenResponse) => {
        socialLogin(
          {
            provider: 'apple',
            accessToken: tokenResponse.authorizationCode || '',
            idToken: tokenResponse.idToken,
          },
          {
            onSuccess: (data) => {
              completeLogin(data?.data);
              action();
            },
            onError: () => {
              console.error('Apple backend auth failed');
            },
          }
        );
      },
      onError: (error) => {
        console.error('Apple Login Failed:', error.message);
      },
    });
  };

  return (
    <Card onCancel={() => router.push('/auth/signup')}>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium tracking-[-0.03em] text-text">
          Sign Up
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-alt">
          Select what best describes you and create your account
        </p>
      </div>

      <p className="mb-4 text-base font-medium text-text">
        How do you want to continue?
      </p>

      {/* Actions */}
      <div className="space-y-3">
        <ContinueButton
          icon={
            <IconWrapper>
              <Mail className="h-5 w-5 text-text-alt" strokeWidth={2} />
            </IconWrapper>
          }
          label="Continue with Email"
          active
          action={() => action()}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <FacebookIcon className="h-5 w-5" />
            </IconWrapper>
          }
          label="Continue with Facebook"
          disabled={!hasFacebookAppId}
          action={handleFacebookSignin}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <GoogleIcon className="h-5 w-5" />
            </IconWrapper>
          }
          label="Continue with Google"
          disabled={!hasGoogleClientId}
          action={handleGoogleSignin}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <AppleIcon className="h-5 w-5 fill-black" />
            </IconWrapper>
          }
          label="Continue with Apple"
          disabled={!hasAppleClientId}
          action={handleAppleSignin}
        />
      </div>
    </Card>
  );
}

type ContinueButtonProps = {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  active?: boolean;
  action?: () => void;
};

function ContinueButton({
  icon,
  label,
  disabled = false,
  active,
  action,
}: ContinueButtonProps) {
  return (
    <button
      className={cn(`
        group flex h-17 w-full items-center justify-between rounded-[12px] border bg-gray-1 px-2 sm:px-4 transition-all cursor-pointer
          ${active ? 'border-blue-7' : 'border-border2 hover:border-primary/40'}
          ${disabled ? 'pointer-events-none opacity-60' : ''}
        `)}
      onClick={() => {
        action?.();
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {icon}

        <span className="text-sm sm:text-base font-medium text-text">
          {label}
        </span>
      </div>

      <ArrowRight
        className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </button>
  );
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-card">
      {children}
    </div>
  );
};
