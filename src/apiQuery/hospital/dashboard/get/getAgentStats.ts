import { ApiResponse } from '@/apiQuery/types';
import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface GetHospitalAgentStatsParams {
  agentId: string;
}
export const getHospitalAgentStats = async (
  params: GetHospitalAgentStatsParams
): Promise<ApiResponse<unknown>> => {
  if (!params.agentId) {
    throw new Error('agentId is required');
  }
  try {
    const response = await axiosClient.get<ApiResponse<unknown>>(
      `/hospitals/agents/${params.agentId}/stats`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }

    throw error;
  }
};

export const useGetHospitalAgentStats = (
  params: GetHospitalAgentStatsParams
) => {
  const result = useQuery({
    // change to useInfiniteQuery
    queryKey: ['hospitals', 'agents', params.agentId],
    queryFn: () => getHospitalAgentStats(params),
  });

  return {
    ...result,
    user: result.data?.data,
  };
};
