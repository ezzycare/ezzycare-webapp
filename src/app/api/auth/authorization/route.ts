import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { val } = await request.json();

  const cookieStore = await cookies();
  const authUser = cookieStore.get('auth-user')?.value;
  const updatedUser = {
    ...JSON.parse(authUser || '{}'),
    requireVerification: val,
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
