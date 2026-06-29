import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Role {
  id: number;
  name: string;
  creatorName: string;
  creatorEmail: string;
  createdAt: string;
}

export type RolesResponse = ApiResponse<Role[]>;

export const getHospitalRoles = async (): Promise<RolesResponse> => {
  try {
    const response = await axiosClient.get<RolesResponse>('/hospitals/roles');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalRoles = () => {
  const result = useQuery({
    queryKey: ['hospitals', 'roles'],
    queryFn: getHospitalRoles,
  });

  return {
    ...result,
    roles: result.data?.data ?? [],
  };
};
