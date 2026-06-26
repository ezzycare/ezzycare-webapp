'use client';

import { ArrowRight, Mail } from 'lucide-react';

import { useSocialLogin } from '@/apiQuery/auth/socialLogin';
import { LoginResponse } from '@/apiQuery/auth/types';
import Card from '@/components/Ui/Card';
import { useAppleLogin } from '@/hooks/useAppleLogin';
import { useFacebookLogin } from '@/hooks/useFacebookLogin';
import { AppleIcon, FacebookIcon, GoogleIcon } from '@/icons/DashboardIcons'; // replace with yours
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { APPLE_CLIENT_ID, FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from '@/utils';
import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

export default function SelectAuthMode({ action }: { action: () => void }) {
  const router = useRouter();
  const authStore = useAuthStore((state: AuthStore) => state);

  const { mutate: socialLogin, isPending } = useSocialLogin();

  const completeLogin = (response: LoginResponse | null) => {
    if (response?.data) {
      if (!response.data?.email_verified) {
        router.push(
          '/auth/verify-email?resend=true&email=' + response.data?.user?.email
        );
        return;
      }
      authStore.updateUser(response.data?.user);
      authStore.setToken(response.data.access_token);
      toaster.success('Login successful');
      router.push('/dashboard');
    }
  };

  const facebookLogin = useFacebookLogin();
  const appleLogin = useAppleLogin();

  const handleGoogleSignin = useGoogleLogin({
    flow: 'implicit',

    onSuccess: async (tokenResponse) => {
      socialLogin(
        {
          provider: 'google',
          accessToken: tokenResponse.access_token,
          idToken: '',
        },
        {
          onSuccess: (data) => {
            completeLogin(data?.data);
            action();
          },
        }
      );
    },

    onError: () => {
      console.error('Google Login Failed');
    },
  });

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
          disabled={!FACEBOOK_APP_ID}
          action={handleFacebookSignin}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <GoogleIcon className="h-5 w-5" />
            </IconWrapper>
          }
          label="Continue with Google"
          disabled={!GOOGLE_CLIENT_ID}
          action={handleGoogleSignin}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <AppleIcon className="h-5 w-5 fill-black" />
            </IconWrapper>
          }
          label="Continue with Apple"
          disabled={!APPLE_CLIENT_ID}
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
