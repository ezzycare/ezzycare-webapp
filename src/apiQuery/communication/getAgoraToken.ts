import { axiosClient } from '@/services/axiosClient';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AgoraTokenData, AgoraTokenResponse } from './types';

interface GetAgoraTokenParams {
  uid: number;
  channelName: string;
}

export const getAgoraToken = async (
  params: GetAgoraTokenParams
): Promise<AgoraTokenResponse> => {
  if (!params.channelName) {
    throw new Error('channelName is required');
  }

  try {
    const response = await axiosClient.get<AgoraTokenResponse>(
      '/communication/agora-token',
      { params: { channelName: params.channelName, uid: params.uid } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data ?? error;
    }
    throw error;
  }
};

export const useGetAgoraToken = (params: GetAgoraTokenParams) => {
  const result = useQuery<AgoraTokenResponse, Error>({
    queryKey: [
      'communication',
      'agora',
      'token',
      params.channelName,
      params.uid,
    ],
    queryFn: () => getAgoraToken(params),
    enabled: !!params.channelName && params.uid > 0,
  });

  return {
    ...result,
    agoraToken: result.data?.data ?? ({} as AgoraTokenData),
  };
};
