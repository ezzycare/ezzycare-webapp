'use server';

import { general } from '@/enums';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const authUser: any = cookieStore.get(general.COOKIE_NAME)?.value;
  const parsedUser = JSON.parse(authUser || '{}');

  return parsedUser;
}

export async function updateSession(token: string) {
  const cookieStore = await cookies();
  const authUser: any = cookieStore.get(general.COOKIE_NAME)?.value;

  const parsedUser = JSON.parse(authUser || '{}');
  parsedUser.access_token = token;

  cookieStore.set(general.COOKIE_NAME, JSON.stringify(parsedUser), {
    // httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return parsedUser;
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(general.COOKIE_NAME);
  cookieStore.delete(general.TOKEN);
  cookieStore.delete(general.USER);
}
