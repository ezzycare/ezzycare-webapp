'use client';

import FancyButton from '@/components/Ui/FancyButton';
import { PasswordInput, TextInput } from '@/components/Ui/TextInput';
import { Cross1Icon, EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import React from 'react';

const SignIn = () => {
  const { push } = useRouter();
  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full">
      <div className="bg-surface-card w-full max-w-117 p-8.5 rounded-[14px] relative">
        <Cross1Icon className="absolute top-6 right-6 cursor-pointer" />
        <h1 className="text-2xl text-text font-medium ">Login</h1>
        <p className="text-sm text-text/50 mt-1.5">login to your account</p>
        <div className="space-y-2 mt-5 flex flex-col">
          <TextInput
            placeholder="email or phone number"
            label="Email"
            leftIcon={<EnvelopeClosedIcon />}
          />
          <PasswordInput placeholder="Enter password" label="Password" />
          <p className="text-sm text-blue-11a ml-auto">Forgot password?</p>
        </div>
        <FancyButton
          className="w-full mt-5 h-12 flex justify-center"
          variant="primary"
          onClick={() => push('/dashboard')}
        >
          Login
        </FancyButton>
        <p className="text-sm text-text/50 mt-4 text-center">
          Don&apos;t have an account?{' '}
          <span className="text-blue-11a ">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
