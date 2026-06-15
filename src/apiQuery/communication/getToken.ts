import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { TwilioTokenData, TwilioTokenResponse } from './types';

interface GetTwilioTokenParams {
  roomName: string;
}

export const getTwilioToken = async (
  params: GetTwilioTokenParams
): Promise<TwilioTokenResponse> => {
  if (!params.roomName) {
    throw new Error('roomName is required');
  }

  try {
    const response = await axiosClient.get<TwilioTokenResponse>(
      '/communication/twilio/token',
      { params: { roomName: params.roomName } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetTwilioToken = (params: GetTwilioTokenParams) => {
  const result = useQuery<TwilioTokenResponse, Error>({
    queryKey: ['communication', 'twilio', 'token', params.roomName],
    queryFn: () => getTwilioToken(params),
    enabled: !!params.roomName,
  });

  return {
    ...result,
    token: result.data?.data ?? ({} as TwilioTokenData),
  };
};
