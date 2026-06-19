import { ApiResponse } from '@/apiQuery/types';

export type ConsultationType = 'VIDEO' | 'HOME' | 'CLINIC';

export type AvailabilityStatus = 'ACTIVE' | 'INACTIVE';

export interface AvailabilitySlot {
  id: string;
  userId: string;
  day: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySettings {
  sameTiming: number;
  availability: AvailabilityStatus;
}

export interface CreateAvailabilitySlotPayload {
  day: string;
  startTime: string;
  endTime: string;
  consultationType: ConsultationType;
}

export interface UpdateAvailabilitySettingsPayload {
  sameTiming: number;
  availability: AvailabilityStatus;
}

export interface DeleteAvailabilitySlotParams {
  id: string;
}

export interface DoctorAvailabilityData {
  slots: AvailabilitySlot[];
  settings: AvailabilitySettings;
}

export type DoctorAvailabilityResponse = ApiResponse<DoctorAvailabilityData>;

export type CreateAvailabilitySlotResponse = ApiResponse<AvailabilitySlot>;

export type DeleteAvailabilitySlotResponse = ApiResponse<unknown>;

export type UpdateAvailabilitySettingsResponse = ApiResponse<unknown>;
