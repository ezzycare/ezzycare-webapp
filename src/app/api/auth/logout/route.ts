// app/api/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(
    'auth-user',
    JSON.stringify({ requireVerification: true }),
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    }
  );

  return response;
}
