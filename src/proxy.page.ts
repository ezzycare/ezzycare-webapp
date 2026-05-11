import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSession } from './services/getSession';

const PUBLIC_PATHS = ['/auth/login', '/auth/forgot-password'];

const STATIC_ASSETS_REGEX =
  /\.(png|jpg|jpeg|svg|webp|ico|js|css|woff2?|ttf|map)$/;

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Allow bypass for test mode
  if (req.cookies.get('x-test-auth')?.value === '1') {
    return NextResponse.next();
  }

  // Skip static assets
  if (STATIC_ASSETS_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  const session = await getSession();

  const isPublic = PUBLIC_PATHS.includes(pathname);

  // Not authenticated → redirect to login
  if (!session?.user && !isPublic) {
    const loginUrl = new URL('/auth/login', origin);
    loginUrl.searchParams.set('next', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Requires verification → force verify flow
  if (session?.requireVerification && !pathname.startsWith('/auth/verify')) {
    const verifyUrl = new URL('/auth/verify', origin);
    return NextResponse.redirect(verifyUrl);
  }

  return NextResponse.next();
}
