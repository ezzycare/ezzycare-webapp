import type { User } from '@/apiQuery/auth/types';
import { ApiResponse } from '@/apiQuery/types';
import { Gender } from '@/apiQuery/users/updateProfile';
import { ConsultationType } from '../availability/types';

export type DoctorAppointmentStatus =
  | 'PENDING'
  | 'UPCOMING'
  | 'IN_PROGRESS'
  | 'PAID'
  | 'UNPAID'
  | 'COMPLETED'
  | 'CANCELLED';

export type AppointmentFilter =
  | 'all'
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'pending';

export interface DoctorAppointmentClient {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  email: string;
  mobileNo: string;
}

export interface DoctorAppointment {
  id: number;
  userId: number;
  clientId: number;
  hospitalId: number | null;
  appointmentType: ConsultationType;
  urgent: number;
  name: string;
  email: string;
  mobileNo: string;
  age: string;
  gender: Gender;
  reason: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentPrice: number;
  otpCode: string | null;
  cancelReason: string | null;
  cancelDate: string | null;
  cancelUserId: string | null;
  status: DoctorAppointmentStatus;
  transactionId: string | null;
  consultNotes: string | null;
  userRating: number | null;
  userReview: string | null;
  userServiceId: string | null;
  completedDatetime: string | null;
  voucherCodeId: string | null;
  voucherAmount: number | null;
  hcpFees: number | null;
  homeVisitFees: number | null;
  totalCharge: number;
  fullDay: number | null;
  address: string;
  city: string;
  country: string;
  myAppointment: number;
  videoStartTime: string | null;
  videoEndTime: string | null;
  longitude: number | null;
  latitude: number | null;
  acceptedDate: string | null;
  appointmentEndDate: string | null;
  appointmentEndTime: string;
  startDatetime: string | null;
  voucherCodeType: string | null;
  isHappyClients: number | null;
  roomName: string | null;
  doctorToken: string | null;
  seekerToken: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  client: DoctorAppointmentClient | User;
  uid: number;
  seekerUid: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DoctorAppointmentsData {
  items: DoctorAppointment[];
  meta: PaginationMeta;
}

export type DoctorAppointmentsResponse = ApiResponse<DoctorAppointmentsData>;

export type DoctorAppointmentResponse = ApiResponse<DoctorAppointment>;

export interface DoctorAppointmentStats {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  pending: number;
  inProgress: number;
}

export type DoctorAppointmentStatsResponse =
  ApiResponse<DoctorAppointmentStats>;

export interface GetDoctorAppointmentsParams {
  page?: number;
  limit?: number;
  filter?: AppointmentFilter;
  hospitalId?: string;
}

export interface GetDoctorAppointmentParams {
  id: number;
}

export interface DeclineAppointmentParams {
  id: number;
  reason: string;
}

export interface CancelAppointmentParams {
  id: number;
  reason: string;
}

export interface StartAppointmentParams {
  id: string;
}

export interface CompleteAppointmentParams {
  id: string;
}

export interface AcceptAppointmentParams {
  id: string;
}

export interface SubmitConsultationNotesParams {
  id: string;
  diagnostic: string;
  symptomsObserved: string;
  prescription: string;
  followUpInstructions: string;
}

export interface RescheduleAppointmentParams {
  id: number;
  appointmentDate: string;
  appointmentTime: string;
}
