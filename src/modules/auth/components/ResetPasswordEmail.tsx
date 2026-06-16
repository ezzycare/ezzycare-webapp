'use client';

import { useForgotPasswordMutation } from '@/apiQuery/auth/forgotPassword';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const ResetPasswordSchema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

const ResetPasswordEmail = ({ action }: { action: () => void }) => {
  const router = useRouter();
  const updateSignupDetails = useAuthStore(
    (state: AuthStore) => state.updateSignupDetails
  );

  const { mutateAsync, isPending } = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: ResetPasswordType) => {
    updateSignupDetails({ email: data.email });
    const payload = {
      email: data.email,
    };
    try {
      const res = await mutateAsync(payload);

      toaster.success(res.message || 'Verification code sent');
      action();
    } catch (error) {
      // toaster.error(error?.message || 'ResetPasswordType failed');
    }
  };

  return (
    <Card className="p-0!">
      <div className="flex flex-col">
        <header className="w-full px-7.25 py-5.75 bg-blue-3 rounded-t-xl grid grid-cols-[1fr_auto] items-center justify-between">
          <div>
            <h1 className="font-medium text-text text-2xl">Reset Password</h1>
            <p className="text-text-alt text-sm mt-1.5">
              Please enter your email to reset your password
            </p>
          </div>

          <div
            className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-7 cursor-pointer"
            onClick={() => router.back()}
          >
            <Cross2Icon className="w-5 h-5 text-surface-card" />
          </div>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 mt-7.75 flex flex-col px-8.5 pb-11.5"
        >
          <TextInput
            label="Email"
            placeholder="email or phone number"
            leftIcon={<EnvelopeClosedIcon />}
            {...register('email')}
            error={errors.email?.message}
          />
          <div className="mt-13">
            <Button
              type="submit"
              className="w-full h-12 flex justify-center"
              variant="primary"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Send Reset Link
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ResetPasswordEmail;
