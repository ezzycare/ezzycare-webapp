import { useAppleSDK } from '@/providers/AppleAuthProvider';

export interface AppleLoginResponse {
  idToken: string;
  authorizationCode?: string;
  user?: {
    name?: {
      firstName?: string;
      lastName?: string;
    };
    email?: string;
  };
}

interface UseAppleLoginOptions {
  onSuccess: (response: AppleLoginResponse) => void;
  onError?: (error: Error) => void;
}

export const useAppleLogin = () => {
  const { isLoaded, isError } = useAppleSDK();

  const login = async ({ onSuccess, onError }: UseAppleLoginOptions) => {
    if (!isLoaded || isError || !window.AppleID) {
      if (onError) {
        onError(new Error('Apple ID SDK is not initialized'));
      }
      return;
    }

    try {
      const response = await window.AppleID.auth.signIn();

      if (response?.authorization?.id_token) {
        onSuccess({
          idToken: response.authorization.id_token,
          authorizationCode: response.authorization.code,
          user: response.user
            ? {
                name: {
                  firstName: response.user.name?.firstName,
                  lastName: response.user.name?.lastName,
                },
                email: response.user.email,
              }
            : undefined,
        });
      } else if (onError) {
        onError(new Error('Sign in with Apple failed - no token received'));
      }
    } catch (error) {
      if (onError) {
        onError(
          error instanceof Error
            ? error
            : new Error('Sign in with Apple failed')
        );
      }
    }
  };

  return login;
};
