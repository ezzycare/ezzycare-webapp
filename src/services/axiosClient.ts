import { handleLogout } from '@/apiQuery/auth/logout';
import axios from 'axios';
import { getAuthToken } from './getAuthToken';

const startGlobalLoading = () => {};
const endGlobalLoading = () => {};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    startGlobalLoading();

    const token = getAuthToken();

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
      console.warn('[Axios] Unauthorized');
      await handleLogout();
    }

    if (status >= 500) {
      console.error('[Axios] Server error:', error.response?.data);
    }

    return Promise.reject(error);
  }
);
