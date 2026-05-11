/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const authUser: any = cookieStore.get('auth-user')?.value;

  const parsedAuthUser = JSON.parse(authUser || '{}');
  return parsedAuthUser;
}

export async function updateSession(token: string) {
  const cookieStore = await cookies();
  const authUser: any = cookieStore.get('auth-user')?.value;

  const parsedAuthUser = JSON.parse(
    authUser || '{ requireVerification: true }'
  );
  const tokenObj = parsedAuthUser?.token;
  tokenObj.accessToken = token;
  const updatedUser = { ...parsedAuthUser, token: tokenObj };

  cookieStore.set('auth-user', JSON.stringify(updatedUser), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return parsedAuthUser;
}
