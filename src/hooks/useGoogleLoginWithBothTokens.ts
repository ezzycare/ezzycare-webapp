const GOOGLE_OAUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const POPUP_WIDTH = 500;
const POPUP_HEIGHT = 600;

export const useGoogleLoginWithBothTokens = () => {
  const login = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const redirectUri = `${appUrl}/auth/google-callback`;

    if (!clientId) {
      console.error('Google Client ID is not configured');
      return;
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'id_token token',
      scope: 'openid profile email',
      nonce: crypto.randomUUID(),
      prompt: 'select_account',
    });

    const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
    const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2;

    window.open(
      `${GOOGLE_OAUTH_URL}?${params.toString()}`,
      'google-oauth-popup',
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top}`
    );
  };

  return login;
};
