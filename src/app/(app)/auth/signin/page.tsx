'use client';

import Card from '@/components/Ui/Card';
import FancyButton from '@/components/Ui/FancyButton';
import { PasswordInput, TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { loginAction } from '@/serverActions/login';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const LoginUserSchema = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginUser = z.infer<typeof LoginUserSchema>;

const SignIn = () => {
  const { push, back } = useRouter();
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
        authStore.updateUser(response.data.user);
        authStore.setToken(response.data.access_token);
        if (!response.data.email_verified) {
          push(
            '/auth/signup/hospital/verify-email?resend=true&email=' + data.email
          );
          return;
        }
        toaster.success('Login successful');
        push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toaster.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card onCancel={() => back()}>
      <h1 className="text-2xl text-text font-medium ">Login</h1>
      <p className="text-sm text-text/50 mt-1.5">login to your account</p>
      <form
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
        <p className="text-sm text-blue-11a ml-auto">Forgot password?</p>
        <FancyButton
          type="submit"
          className="w-full mt-5 h-12 flex justify-center"
          variant="primary"
          loading={loading}
          disabled={Object.keys(errors).length > 0 || loading}
        >
          Login
        </FancyButton>
      </form>
      <p className="text-sm text-text/50 mt-4 text-center">
        Don&apos;t have an account?{' '}
        <span className="text-blue-11a ">Sign up</span>
      </p>
    </Card>
  );
};

export default SignIn;
