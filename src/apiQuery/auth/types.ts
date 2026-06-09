import { ApiResponse } from '@/apiQuery/types';

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

export type ACCOUNT_TYPE = 'HOSPITAL' | 'AGENT' | 'ADMIN' | 'DOCTOR' | 'SEEKER';

export interface User {
  id: string;
  categoryId: string | null;
  subcategoryId: string | null;
  ezzycareCard: string | null;
  firstName: string;
  lastName: string;
  email: string;
  emailVerifiedAt: string | null;
  countryCode: string | null;
  mobileNo: string;
  mobileVerifiedAt: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  profileImage: string | null;
  deviceType: string | null;
  deviceUuid: string | null;
  deviceToken: string | null;
  socialType: string | null;
  facebookId: string | null;
  googleId: string | null;
  appleId: string | null;
  latitude: number | null;
  longitude: number | null;
  walletBalance: number;
  status: string;
  notificationStatus: number;
  approvedDate: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  lockWalletBalance: number;
  userTimezone: string | null;
  userIp: string | null;
  completedPercentage: number;
  welcomeBonus: number;
  registerType: string | null;
  tokenVersion: number;
  accountType: ACCOUNT_TYPE;
  employerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hospitalroleId: number | null;
  userDetails?: UserDetails;
  account_type: string;
  account_type_label: string;
  profileCompleted: boolean;
}

export interface UserDetails {
  id: string;
  userId: string;
  clinicHospitalName: string;
  aboutUs: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  pincode: string | null;
  emergencyContact: string | null;
  emergencyContactName: string | null;
  dob: string | null;
  maritalStatus: string | null;
  bloodGroup: string | null;
  height: number | null;
  weight: number | null;
  allergies: string | null;
  smokingHabits: string | null;
  alcoholConsumption: string | null;
  foodPreference: string | null;
  occupation: string | null;
  normalFees: number | null;
  urgentFees: number | null;
  homeVisitFees: number | null;
  deliveryCharge: number | null;
  urgent: number | null;
  availability: string | null;
  registrationNo: string | null;
  registrationCouncil: string | null;
  registrationYear: string | null;
  clinicName: string | null;
  clinicCity: string | null;
  clinicLocality: string | null;
  qualificationCertificate: string | null;
  practicingLicence: string | null;
  healthFacilityCertificate: string | null;
  regstrationCertificate: string | null;
  pharmacistCertificate: string | null;
  qualificationCertStatus: string | null;
  practicingLicenceStatus: string | null;
  healthFacilityCertStatus: string | null;
  regstrationCertStatus: string | null;
  pharmacistCertStatus: string | null;
  totalExperienceYear: number | null;
  sameTiming: boolean | null;
  feesHour: number | null;
  feesDay: number | null;
  feesMinute: number | null;
  activityLevel: string | null;
  currentMedications: string | null;
  pastMedications: string | null;
  chronicDisease: string | null;
  injuries: string | null;
  surgeries: string | null;
  clinicPlace: string | null;
  clinicState: string | null;
  clinicCountry: string | null;
  clinicConsultationCharge: number | null;
  homeConsultationCharge: number | null;
  videoConsultationCharge: number | null;
  nursingFacilityChargeFullDay: number | null;
  nursingHomeVisitChargeFullDay: number | null;
  addressType: string | null;
  practicingLicenceDate: string | null;
  urgentCriteria: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerifiedUserResponse {
  access_token: string;
  email_verified: boolean;
  is_account_type_selected: boolean;
  user: User;
}

export type LoginResponse = ApiResponse<VerifiedUserResponse>;
