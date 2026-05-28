'use client';

import { resendOtp } from '@/apiQuery/auth/login';
import { User } from '@/apiQuery/hospital/auth/types';
import {
  useVerifyEmail,
  VerifyEmailPayload,
} from '@/apiQuery/hospital/auth/verifyEmail';
import Card from '@/components/Ui/Card';
import FancyButton from '@/components/Ui/FancyButton';
import OtpInput from '@/components/Ui/OtpInput';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const resend = searchParams.get('resend');
  const loginEmail = searchParams.get('email');
  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');
  const { mutateAsync, isPending } = useVerifyEmail();
  const authStore = useAuthStore((state: AuthStore) => state);
  const authEmail = authStore.hospitalRegDetails.email;

  const handleResendOtp = async () => {
    try {
      await resendOtp({
        email: loginEmail || authEmail,
        reason: 'signup',
      });
      toaster.success('Verification code sent');
    } catch (error) {
      // toaster.error(error?.message || 'Verification failed');
    }
  };

  useEffect(() => {
    if (resend) {
      handleResendOtp();
    }
  }, [resend]);

  const handleVerifyEmail = async () => {
    if (!authEmail || !otpCode?.length) {
      return;
    }
    const payload: VerifyEmailPayload = {
      email: authEmail,
      code: otpCode,
    };
    try {
      const { data, message } = await mutateAsync(payload);
      authStore.updateUser(data as unknown as User);
      toaster.success(message || 'Email verified successfully');
      router.push('/auth/signup/hospital/upload-docs');
    } catch (error) {
      // toaster.error(error?.message || 'Verification failed');
    }
  };

  return (
    <Card onCancel={() => router.push('/auth/hospital/signin')}>
      <div className="flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl text-text font-medium">Verify your email</h2>
        <p className="text-sm text-text-alt">
          We have sent you a verification code to your email address
        </p>
        <OtpInput
          length={6}
          timeout={60}
          onChange={(otp) => setOtpCode(otp)}
          resendOtpFunction={handleResendOtp}
        />

        <FancyButton
          variant="primary"
          className="w-full mt-10"
          onClick={handleVerifyEmail}
          disabled={isPending || otpCode.length < 6}
          loading={isPending}
        >
          Verify
        </FancyButton>
      </div>
    </Card>
  );
};

export default VerifyEmail;
