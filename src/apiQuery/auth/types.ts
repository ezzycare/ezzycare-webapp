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

export type SendOtpRequestPropsType =
  | {
      email: string;
    }
  | {
      phoneNumber: string;
    };

export type VerifyOtpRequestPropsType = {
  key: string;
  otp: string;
};
