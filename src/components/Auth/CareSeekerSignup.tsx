'use client';

import { useSignUpMutation } from '@/apiQuery/auth/signup';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import {
  PasswordInput,
  PhoneInput,
  TextInput,
} from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SignUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  mobileNo: z
    .string()
    .min(10, 'Enter a valid phone number')
    .regex(/^[+]?[0-9\s\-()]{7,20}$/),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
type Registration = z.infer<typeof SignUpSchema>;

const CareSeekerSignup = ({ action }: { action: () => void }) => {
  const router = useRouter();

  const { updateSignupDetails } = useAuthStore((state: AuthStore) => state);
  const { mutateAsync, isPending } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(SignUpSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: Registration) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      mobileNo: data.mobileNo,
      password: data.password,
      accountType: 'SEEKER' as const,
    };
    try {
      const res = await mutateAsync(payload);
      updateSignupDetails(payload);

      toaster.success(res.message || 'Verification code sent');
      action();
    } catch (error) {
      // toaster.error(error?.message || 'Registration failed');
    }
  };

  return (
    <Card onCancel={() => router.back()}>
      <div className="flex flex-col">
        <h1 className="font-medium text-text text-2xl">Sign Up</h1>
        <p className="text-text-alt text-sm mt-1.5">
          Fill in the details below to create your account
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 mt-5 flex flex-col"
        >
          <TextInput
            label="First Name"
            placeholder="E.g Emmanuel"
            leftIcon={<UserIconLocal className="text-text-muted" />}
            {...register('firstName')}
            error={errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            placeholder="E.g Stephen"
            leftIcon={<UserIconLocal className="text-text-muted" />}
            {...register('lastName')}
            error={errors.lastName?.message}
          />
          <TextInput
            label="Email"
            placeholder="email@domain.com"
            leftIcon={<EnvelopeClosedIcon />}
            {...register('email')}
            error={errors.email?.message}
          />
          <PhoneInput
            label="Phone"
            placeholder="08012345678"
            {...register('mobileNo')}
            error={errors?.mobileNo?.message}
          />
          <PasswordInput
            label="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="mt-8 space-y-2">
            <p className="text-xs text-text-muted text-center">
              By signing up, you agree to our Terms and Privacy Policy
            </p>
            <Button
              type="submit"
              className="w-full h-12 flex justify-center"
              variant="primary"
              loading={isPending}
              disabled={!isValid || isPending}
            >
              Sign Up
            </Button>
            <p className="text-sm text-text-muted text-center flex items-center justify-center">
              Already have an account?
              <Link href="/auth/signin" className="text-primary">
                {' '}
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default CareSeekerSignup;
