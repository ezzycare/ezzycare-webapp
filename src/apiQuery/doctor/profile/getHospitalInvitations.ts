import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { axiosClient } from '@/services/axiosClient';
import type { HospitalInvitationsResponse } from './types';

export const getHospitalInvitations =
  async (): Promise<HospitalInvitationsResponse> => {
    try {
      const response = await axiosClient.get<HospitalInvitationsResponse>(
        '/doctors/hospital-invitations'
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ?? error;
      }
      throw error;
    }
  };

export const useGetHospitalInvitationsQuery = () => {
  const result = useQuery({
    queryKey: ['doctor', 'hospital-invitations'],
    queryFn: getHospitalInvitations,
  });

  return {
    ...result,
    invitations: result.data?.data,
  };
};
