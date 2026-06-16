/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { resendOtp } from '@/apiQuery/auth/login';
import { VerifyEmailPayload } from '@/apiQuery/auth/verifyEmail';
import { useVerifyForgotPasswordOtpMutation } from '@/apiQuery/auth/verifyForgotPassword';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import OtpInput from '@/components/Ui/OtpInput';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const ResetPasswordOtp = ({ action }: { action: () => void }) => {
  const searchParams = useSearchParams();
  const resend = searchParams.get('resend');

  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');

  const { mutateAsync, isPending } = useVerifyForgotPasswordOtpMutation();

  const authStore = useAuthStore((state: AuthStore) => state);
  const authEmail = useMemo(() => authStore.signupDetails.email, [authStore]);

  const handleResendOtp = async () => {
    try {
      await resendOtp({
        email: authEmail,
        reason: 'password-reset',
      });

      toaster.success('Verification code sent');
    } catch (error) {}
  };

  useEffect(() => {
    if (resend) {
      handleResendOtp();
    }
  }, []);

  const handleVerifyEmail = async () => {
    const emailForVerification = authEmail;
    if (!emailForVerification || !otpCode?.length) {
      return;
    }

    const payload: VerifyEmailPayload = {
      email: emailForVerification,
      code: otpCode,
    };

    try {
      const { data, message } = await mutateAsync(payload);

      authStore.setPasswordResetToken(data?.access_token as string);
      toaster.success(message || 'Email verified successfully');
      action();
    } catch (error: Error | any) {
      toaster.success(error?.message || 'Email verification failed');
    }
  };

  return (
    <Card onCancel={() => router.push('/auth/signin')}>
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

export default ResetPasswordOtp;
