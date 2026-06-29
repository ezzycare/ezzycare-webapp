import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface TeamSummary {
  totalMembers: number;
  activeMembers: number;
  customRoles: number;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: string;
}

export interface TeamData {
  summary: TeamSummary;
  members: TeamMember[];
}

export const getHospitalTeam = async (): Promise<ApiResponse<TeamData>> => {
  try {
    const response =
      await axiosClient.get<ApiResponse<TeamData>>('/hospitals/team');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalTeam = () => {
  const result = useQuery({
    queryKey: ['hospitals', 'team'],
    queryFn: getHospitalTeam,
  });

  return {
    ...result,
    team: result.data?.data,
  };
};
