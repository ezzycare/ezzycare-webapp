/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { baseURL } from '../baseUrl';

export const resetPassword = async ({ password }: { password: string }) => {
  try {
    const response = await axios.post(`${baseURL}/auth/reset-password`, {
      password,
    });

    return response.data;
  } catch (error: any) {
    throw error;
  }
};
