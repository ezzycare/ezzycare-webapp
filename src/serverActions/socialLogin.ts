'use server';

import { LoginResponse } from '@/apiQuery/auth/types';
import { general } from '@/enums';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';

export async function socialLoginAction(response: LoginResponse) {
  try {
    if (!response?.success || !response?.data?.user) {
      return {
        success: false,
        error: response?.message || 'Server Error',
      };
    }

    const updatedUser: LoginResponse['data'] & { expires: string } = {
      ...response.data,
      expires: dayjs().add(10, 'minute').toISOString(),
    };

    if (updatedUser.email_verified) {
      const cookieStore = await cookies();

      cookieStore.set(
        general.COOKIE_NAME,
        JSON.stringify({
          ...updatedUser,
          user: {
            id: response.data.user.id,
            firstName: response.data.user.firstName,
            lastName: response.data.user.lastName,
            email: response.data.user.email,
            mobileNo: response.data.user.mobileNo,
            accountType: response.data.user.accountType,
            account_type: response.data.user.accountType,
            profileCompleted: response.data.user.profileCompleted,
          },
        }),
        {
          secure: process.env.NODE_ENV === 'production',
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
