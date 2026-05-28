import { ApiResponse } from '../auth/types';

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
