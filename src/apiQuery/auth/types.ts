import { ApiResponse, VerifiedUserResponse } from '../hospital/auth/types';

type AuthByEmail = {
  email: string;
  phoneNumber?: never;
  password: string;
};

type AuthByPhone = {
  phoneNumber: string;
  email?: never;
  password: string;
};

export type LoginType = AuthByEmail | AuthByPhone;

export type ReSendOtpRequestProps = {
  email: string;
  reason: string;
};

export type VerifyOtpRequestPropsType = {
  key: string;
  otp: string;
};

export type LoginResponse = ApiResponse<VerifiedUserResponse>;
