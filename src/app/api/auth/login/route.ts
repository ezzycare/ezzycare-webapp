import { login } from '@/apiQuery/auth/login';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  const loginResponse = await login({ email, password });

  if (loginResponse?.status !== 200) {
    NextResponse.json(
      {
        error: loginResponse?.response?.data?.message || loginResponse.message,
      },
      { status: loginResponse.status }
    );
  }

  if (!loginResponse?.data?.user) {
    return NextResponse.json(
      { error: loginResponse?.response?.data?.message || 'Server Error' },
      { status: 401 }
    );
  }

  const user = loginResponse.data.user;
  const token = loginResponse.data.token;
  const updatedUser = {
    user,
    token,
    requireVerification: true,
    expires: dayjs().add(10, 'minute').toISOString(),
  };

  const response = NextResponse.json({ success: true });

  response.cookies.set('auth-user', JSON.stringify(updatedUser), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return response;
}
