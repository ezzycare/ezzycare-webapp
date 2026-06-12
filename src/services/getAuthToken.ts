import { general } from '@/enums';

export const getCookie = () => {
  if (typeof window === 'undefined') return null;

  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith('ezzy-auth-user='));

  if (match) {
    try {
      const value = match.split('=')[1];
      const cookie = JSON.parse(decodeURIComponent(value));
      return cookie ?? null;
    } catch {
      return null;
    }
  }

  return null;
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  const cookie = getCookie();
  const sessionToken = cookie?.access_token;
  if (sessionToken) return sessionToken;

  return sessionStorage.getItem(general.TOKEN);
};
