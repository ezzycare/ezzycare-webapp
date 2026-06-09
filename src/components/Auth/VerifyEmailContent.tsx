'use client';

import { resendOtp } from '@/apiQuery/auth/login';
import { User } from '@/apiQuery/auth/types';
import {
  useVerifyEmail,
  VerifyEmailPayload,
} from '@/apiQuery/auth/verifyEmail';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import OtpInput from '@/components/Ui/OtpInput';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const resend = searchParams.get('resend');
  const loginEmail = searchParams.get('email');
  const verifyType = searchParams.get('type');

  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');

  const { mutateAsync, isPending } = useVerifyEmail();

  const authStore = useAuthStore((state: AuthStore) => state);
  const authEmail = authStore.signupDetails.email;

  const handleResendOtp = async () => {
    try {
      await resendOtp({
        email: loginEmail || authEmail,
        reason: verifyType || 'signup',
      });

      toaster.success('Verification code sent');
    } catch (error) {}
  };

  useEffect(() => {
    if (resend) {
      handleResendOtp();
    }
  }, [resend]);

  const handleVerifyEmail = async () => {
    const emailForVerification = loginEmail || authEmail;
    if (!emailForVerification || !otpCode?.length) {
      return;
    }

    const payload: VerifyEmailPayload = {
      email: emailForVerification,
      code: otpCode,
    };

    try {
      const { data, message } = await mutateAsync(payload);

      authStore.updateUser(data as unknown as User);

      toaster.success(message || 'Email verified successfully');

      // router.push('/auth/signup/hospital/upload-docs');
    } catch (error) {}
  };

  return (
    <Card onCancel={() => router.back()}>
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

        <Button
          variant="primary"
          className="w-full mt-10"
          onClick={handleVerifyEmail}
          disabled={isPending || otpCode.length < 6}
          loading={isPending}
        >
          Verify
        </Button>
      </div>
    </Card>
  );
};

export default VerifyEmailContent;
