import { axiosClient } from '@/services/axiosClient';
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query';
import axios from 'axios';

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
}

export interface GetAvailableTimeSlotsParams {
  id: string;
  date: string;
  type: 'CLINIC' | 'HOME' | 'VIDEO';
}

export interface AvailableTimeSlotsResponse {
  success: boolean;
  message: string;
  data: AvailableTimeSlot[];
}

export const getAvailableTimeSlots = async ({
  id,
  date,
  type,
}: GetAvailableTimeSlotsParams): Promise<AvailableTimeSlotsResponse> => {
  try {
    const response = await axiosClient.get<AvailableTimeSlotsResponse>(
      `/doctors-discovery/${id}/available-slots`,
      { params: { date, type } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetAvailableTimeSlotsQuery = (
  params: GetAvailableTimeSlotsParams | null,
  options?: Omit<
    UseQueryOptions<AvailableTimeSlotsResponse>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AvailableTimeSlotsResponse> => {
  return useQuery({
    queryKey: ['doctor', 'available-slots', params],
    queryFn: () => getAvailableTimeSlots(params!),
    enabled: !!params,
    ...options,
  });
};
