import { ApiResponse } from '@/apiQuery/types';

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

export type ConsultationType = 'CLINIC' | 'VIDEO' | 'HOME';

export type PayoutMethod = 'HOSPITAL_MANAGED' | 'PLATFORM_MANAGED';
