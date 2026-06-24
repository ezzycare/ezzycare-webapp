'use client';

import { useResetPasswordMutation } from '@/apiQuery/auth/resetPassword';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { PasswordInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        'Password must contain at least one letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (v: string) => v.length >= 8 },
  { label: 'An uppercase letter', test: (v: string) => /[A-Z]/.test(v) },
  { label: 'A lowercase letter', test: (v: string) => /[a-z]/.test(v) },
  { label: 'A number', test: (v: string) => /\d/.test(v) },
  { label: 'A special character', test: (v: string) => /[@$!%*#?&]/.test(v) },
] as const;

const NewPasswordForm = ({ action }: { action: () => void }) => {
  const router = useRouter();
  const passwordResetToken = useAuthStore(
    (state: AuthStore) => state.passwordResetToken
  );

  const { mutateAsync, isPending } = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: 'onTouched',
  });

  // Watch the password field so checks re-evaluate on every keystroke
  const passwordValue = watch('password', '');

  const passwordChecks = useMemo(
    () =>
      PASSWORD_RULES.map((rule) => ({
        label: rule.label,
        valid: rule.test(passwordValue ?? ''),
      })),
    [passwordValue]
  );

  const onSubmit = async (data: ResetPasswordType) => {
    try {
      const res = await mutateAsync({
        newPassword: data.password,
        token: passwordResetToken ?? '',
      });
      toaster.success(res.message || 'Password reset successful');
      action();
    } catch (error) {
      // toaster.error(...)
    }
  };

  return (
    <Card className="p-0!">
      <div className="flex flex-col">
        <header className="w-full px-7.25 py-5.75 bg-blue-3 rounded-t-xl grid grid-cols-[1fr_auto] items-center justify-between">
          <div>
            <h1 className="font-medium text-text text-2xl">Reset Password</h1>
            <p className="text-text-alt text-sm mt-1.5">
              Please enter and confirm your new password
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
          className="space-y-4.5 mt-7.75 flex flex-col px-8.5 pb-11.5"
        >
          <PasswordInput
            label="Password"
            placeholder="*******************"
            {...register('password')}
            // error={errors.password?.message}
          />

          <p className="text-text-alt text-xs">AT LEAST:</p>
          <ul className="flex items-center flex-wrap gap-2 mt-2 space-y-1">
            {passwordChecks.map((check) => (
              <p
                key={check.label}
                className={`flex items-center gap-2 text-xs transition-colors px-2 py-1.5 border rounded-lg ${
                  check.valid
                    ? 'text-blue-11 border-blue-3a'
                    : 'text-text-muted border-gray-4'
                }`}
              >
                {check.label}
              </p>
            ))}
          </ul>

          <PasswordInput
            label="Confirm Password"
            placeholder="*******************"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <div className="mt-9.5 space-y-2">
            <Button
              type="submit"
              className="w-full h-12 flex justify-center"
              variant="primary"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default NewPasswordForm;
