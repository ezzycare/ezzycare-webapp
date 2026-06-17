import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionFromRequest } from './services/getSessionFromRequest';

const AUTH_PATHS_FOR_AUTHENTICATED = new Set<string>([
  '/auth/verify-email',
  '/payment/callback',
]);

export async function proxy(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  // Allow bypass for test mode
  if (req.cookies.get('x-test-auth')?.value === '1') {
    return NextResponse.next();
  }

  let session: Record<string, unknown> = {};

  try {
    session = getSessionFromRequest(req);
  } catch {
    // Malformed cookie — skip auth checks
  }

  // Only redirect authenticated users away from auth pages
  if (
    session?.access_token &&
    pathname?.includes('/auth') &&
    !AUTH_PATHS_FOR_AUTHENTICATED.has(pathname)
  ) {
    req.headers.set('Authorization', `Bearer ${session.access_token}`);
    return NextResponse.redirect(new URL('/dashboard', origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
