import { ApiResponse } from '@/apiQuery/types';
import { User } from '../auth/types';

export interface DashboardStats {
  totalDoctors: number;
  totalAgents: number;
  totalAppointments: number;
  totalPatients: number;
  pendingAppointments: number;
  revenue: number;
  availableDoctors: number;
  unavailableDoctors: number;
  doctorsInSession: number;
}

export type DashboardResponse = ApiResponse<DashboardStats>;

export interface AgentsInterface {
  id: string;
}

export type PayoutMethod = 'HOSPITAL_MANAGED' | 'PLATFORM_MANAGED';

export type ConsultationType = 'CLINIC' | 'VIDEO' | 'HOME';

export interface HospitalAppointmentClient {
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
  gender: string;
  profileImage: string | null;
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
  accountType: string;
  employerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hospitalRoleId: string | null;
}

export interface HospitalAppointmentDoctor {
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
  gender: string;
  profileImage: string | null;
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
  accountType: string;
  employerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  hospitalRoleId: string | null;
}

export interface HospitalAppointment {
  id: string;
  userId: string;
  clientId: string;
  hospitalId: string;
  appointmentType: ConsultationType;
  urgent: number;
  name: string;
  email: string;
  mobileNo: string;
  age: string;
  gender: string;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string | null;
  appointmentEndDate: string | null;
  appointmentPrice: number;
  totalCharge: number;
  hcpFees: number | null;
  homeVisitFees: number | null;
  otpCode: string | null;
  cancelReason: string | null;
  cancelDate: string | null;
  cancelUserId: string | null;
  status: string;
  transactionId: string | null;
  consultNotes: string | null;
  userRating: number | null;
  userReview: string | null;
  userServiceId: string | null;
  completedDatetime: string | null;
  voucherCodeId: string | null;
  voucherCodeType: string | null;
  voucherAmount: number | null;
  fullDay: boolean | null;
  address: string;
  city: string;
  country: string;
  myAppointment: number;
  videoStartTime: string | null;
  videoEndTime: string | null;
  latitude: number | null;
  longitude: number | null;
  acceptedDate: string | null;
  startDatetime: string | null;
  isHappyClients: boolean | null;
  roomName: string | null;
  doctorToken: string | null;
  seekerToken: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  client: HospitalAppointmentClient;
  user: HospitalAppointmentDoctor;
}

export type HospitalAppointmentsResponse = ApiResponse<HospitalAppointment[]>;

export type HospitalProfile = User;
export type HospitalProfileResponse = ApiResponse<HospitalProfile>;
