'use client';

import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { PasswordInput, TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { loginAction } from '@/serverActions/login';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const LoginUserSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginUser = z.infer<typeof LoginUserSchema>;

const SignInForm = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next');

  const authStore = useAuthStore((state: AuthStore) => state);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(LoginUserSchema),
  });

  const onSubmit = async (data: LoginUser) => {
    setLoading(true);
    try {
      const response = await loginAction(data);

      if (response.success === false && response.error) {
        setError('email', { message: response.error });
        toaster.error(response.error);
        return;
      }

      if (response.data) {
        console.log({ response });
        setLoading(true);
        if (!response.data.email_verified) {
          push(
            `/auth/verify-email?type=signin&email=${encodeURIComponent(data.email)}`
          );

          return;
        }

        authStore.updateUser(response.data.user);
        authStore.setToken(response.data.access_token);

        push(next || '/dashboard');
        toaster.success('Login successful');
      }
    } catch (error) {
      console.error(error);
      toaster.error('Something went wrong');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card onCancel={() => push('/')}>
      <h1 className="text-2xl text-text font-medium ">Login</h1>
      <p className="text-sm text-text/50 mt-1.5">login to your account</p>
      <form
        method="post"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2 mt-5 flex flex-col"
      >
        <TextInput
          placeholder="email or phone number"
          label="Email"
          leftIcon={<EnvelopeClosedIcon />}
          {...register('email')}
          name="email"
          error={errors.email?.message}
        />
        <PasswordInput
          placeholder="Enter password"
          label="Password"
          {...register('password')}
          name="password"
          error={errors.password?.message}
        />
        <p
          className="text-sm text-blue-11a ml-auto cursor-pointer"
          onClick={() => push('/auth/reset-password')}
        >
          Forgot password?
        </p>
        <Button
          type="submit"
          className="w-full mt-5 h-12 flex justify-center"
          variant="primary"
          loading={loading}
          disabled={Object.keys(errors).length > 0 || loading}
        >
          Login
        </Button>
      </form>
      <p className="text-sm text-text/50 mt-4 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-blue-11a">
          {' '}
          Sign up
        </Link>
      </p>
    </Card>
  );
};

const SignIn = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <SignInForm />
  </Suspense>
);

export default SignIn;
