'use server';

import { login } from '@/apiQuery/auth/login';
import { LoginResponse } from '@/apiQuery/auth/types';
import { general } from '@/enums';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';

type LoginPayload = {
  email: string;
  password: string;
};

export async function loginAction({ email, password }: LoginPayload) {
  try {
    const loginResponse: LoginResponse = await login({
      email,
      password,
    });

    if (!loginResponse?.success) {
      return {
        success: false,
        error: loginResponse?.message,
        message: loginResponse?.message,
      };
    }

    if (!loginResponse?.data?.user) {
      return {
        success: false,
        error: loginResponse?.message || 'Server Error',
      };
    }

    const updatedUser: LoginResponse['data'] & { expires: string } = {
      ...loginResponse?.data,
      expires: dayjs().add(10, 'minute').toISOString(),
    };

    if (updatedUser.email_verified) {
      const cookieStore = await cookies();

      cookieStore.set(
        general.COOKIE_NAME,
        JSON.stringify({
          ...updatedUser,
          user: {
            id: loginResponse.data.user.id,
            firstName: loginResponse.data.user.firstName,
            lastName: loginResponse.data.user.lastName,
            email: loginResponse.data.user.email,
            mobileNo: loginResponse.data.user.mobileNo,
            accountType: loginResponse.data.user.accountType,
            account_type: loginResponse.data.user.accountType,
            profileCompleted: loginResponse.data.user.profileCompleted,
          },
        }),
        {
          // httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          // secure: false,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/',
        }
      );
    }

    return {
      success: true,
      data: updatedUser,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return {
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong',
    };
  }
}
