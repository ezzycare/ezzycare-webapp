import { general } from '@/enums';
import type { NextRequest } from 'next/server';

export function getSessionFromRequest(req: NextRequest) {
  const cookie = req.cookies.get(general.COOKIE_NAME)?.value;
  return JSON.parse(cookie || '{}');
}
