import { handleLogout } from '@/apiQuery/auth/logout';
import { general } from '@/enums';
import axios from 'axios';

const getAuthToken = async (): Promise<string | null> => {
  // const cookieStore = await cookies();
  // const authUserString = cookieStore.get('auth-user')?.value;
  // const authUser = JSON.parse(authUserString || '{}');
  // const authToken = authUser?.token?.accessToken;

  // console.log({ authToken });
  // if (authToken) {
  //   return authToken;
  // }

  // return '';
  return sessionStorage.getItem(general.TOKEN);
};

const startGlobalLoading = () => {
  // setGlobalLoading(true);
};

const endGlobalLoading = () => {
  // setGlobalLoading(false);
};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    startGlobalLoading();

    const token = await getAuthToken();
    if (token) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[Axios] Auth token:', token);
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    endGlobalLoading();
    console.error('[Axios] Request error:', error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    endGlobalLoading();
    return response;
  },
  async (error) => {
    endGlobalLoading();

    const status = error.response?.status;

    if (status === 401) {
      console.warn('[Axios] Unauthorized – maybe redirect to login.');
      // toaster.error(error.response?.data.message);
      await handleLogout();
    }

    if (status >= 500) {
      console.error('[Axios] Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);
