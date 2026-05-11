import { getSession, updateSession } from '@/services/getSession';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const session = await getSession();
  return NextResponse.json({ data: session, success: true });
}

export async function POST(request: Request) {
  const { token } = await request.json();
  const session = await updateSession(token);

  return NextResponse.json({ data: session, success: true });
}
