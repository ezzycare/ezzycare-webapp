/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { baseURL } from '../baseUrl';

export const forgotPassword = async ({ email }: { email: string }) => {
  try {
    const response = await axios.post(`${baseURL}/auth/forgot-password`, {
      email,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
