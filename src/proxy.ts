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

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
