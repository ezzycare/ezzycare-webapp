import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getSessionFromRequest } from './services/getSessionFromRequest';
import { blockedNavItems, navItems } from './utils/route';

// Filter landing page links
const navPrefixes = navItems
  ?.map((i) => i.path)
  ?.filter((p) => p !== '#' && p !== '/');

const PUBLIC_PREFIXES = [...navPrefixes, '/auth'];
const PUBLIC_EXACT = new Set<string>(['/']);

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

  const session = getSessionFromRequest(req);

  const isPublic =
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  const isBlocked = blockedNavItems(session?.user?.accountType).includes(
    pathname
  );

  if ((!session?.access_token && !isPublic) || isBlocked) {
    const loginUrl = new URL('/auth/signin', origin);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

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
