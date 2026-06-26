import { useFacebookSDK } from '@/providers/FacebookAuthProvider';

export interface FacebookLoginResponse {
  accessToken: string;
  userID?: string;
  expiresIn?: number;
  signedRequest?: string;
  graphDomain?: string;
  data_access_expiration_time?: number;
}

interface UseFacebookLoginOptions {
  onSuccess: (response: FacebookLoginResponse) => void;
  onError?: (error: Error) => void;
}

export const useFacebookLogin = () => {
  const { isLoaded, isError } = useFacebookSDK();

  const login = ({ onSuccess, onError }: UseFacebookLoginOptions) => {
    if (!isLoaded || isError || !window.FB) {
      if (onError) {
        onError(new Error('Facebook SDK is not initialized'));
      }
      return;
    }

    window.FB.login(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        if (response.authResponse) {
          onSuccess({
            accessToken: response.authResponse.accessToken,
            userID: response.authResponse.userID,
            expiresIn: response.authResponse.expiresIn,
            signedRequest: response.authResponse.signedRequest,
            graphDomain: response.authResponse.graphDomain,
            data_access_expiration_time:
              response.authResponse.data_access_expiration_time,
          });
        } else if (onError) {
          onError(new Error('Facebook login was cancelled or failed'));
        }
      },
      { scope: 'email,public_profile' }
    );
  };

  return login;
};
