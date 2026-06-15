import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface TeamSummary {
  totalMembers: number;
  activeMembers: number;
  customRoles: number;
}

export interface TeamData {
  summary: TeamSummary;
  members: unknown[];
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
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'team'],
    queryFn: getHospitalTeam,
  });

  return {
    ...result,
    team: result.data?.data,
  };
};
