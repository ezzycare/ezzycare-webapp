import { ApiResponse } from '@/apiQuery/types';

export interface DoctorProfileExperience {
  hospitalName: string;
  jobRole: string;
  startDate: string;
  endDate: string;
}

export interface DoctorProfileEducation {
  degree: string;
  university: string;
  startDate: string;
  endDate: string;
}

export type DoctorUrgentCriteria = 'VIDEO' | 'HOME';

export interface UpdateDoctorProfilePayload {
  experience?: DoctorProfileExperience;
  education?: DoctorProfileEducation;
  urgentCriteria?: DoctorUrgentCriteria[];
  aboutUs?: string;
  subcategoryId?: number;
  feesMinute?: number;
  feesHour?: number;
  clinicConsultationCharge?: number;
  videoConsultationCharge?: number;
  homeConsultationCharge?: number;
  clinicName?: string;
  clinicState?: string;
  clinicCountry?: string;
  practicingLicenceDate?: string;
  university?: string;
  yearGraduated?: string;
  yearsOfExperience?: string;
  address?: string;
  clinicPlace?: string;
  latitude?: number;
  longitude?: number;
  occupation?: string;
  city?: string;
  country?: string;
}

export interface UploadCertificationPayload {
  medicalCertificate: File;
  currentPracticeLicense: File;
  specialtyTrainingCertificate: File;
}

export interface HospitalInvitation {
  id: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLogo: string | null;
  department: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  createdAt: string;
}

export type DoctorProfileResponse = ApiResponse<unknown>;

export type UpdateDoctorProfileResponse = ApiResponse<unknown>;

export type UploadCertificationResponse = ApiResponse<unknown>;

export type HospitalInvitationsResponse = ApiResponse<HospitalInvitation[]>;

export type AcceptHospitalInvitationResponse = ApiResponse<unknown>;
