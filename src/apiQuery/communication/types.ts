import { ApiResponse } from '@/apiQuery/types';

export interface TwilioRoomData {
  sid: string;
  roomName: string;
  uniqueName: string;
  status: string;
  createdAt: string;
}

export type CreateRoomResponse = ApiResponse<TwilioRoomData>;

export interface TwilioTokenData {
  token: string;
  identity: string;
  roomName: string;
}

export type TwilioTokenResponse = ApiResponse<TwilioTokenData>;

export interface AgoraTokenData {
  token: string;
  channelName: string;
  uid: number;
  appId: string;
}

export type AgoraTokenResponse = ApiResponse<AgoraTokenData>;

export interface SendSmsParams {
  to: string;
  message: string;
}

export interface SendSmsData {
  status: string;
  messageId: string;
}

export type SendSmsResponse = ApiResponse<SendSmsData>;
