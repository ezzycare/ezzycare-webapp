import { DoctorType } from './doctors';
import { HospitalType } from './hospitals';

export type BookingType = {
  id: number;
  bookingId: string;
  patientName: string;
  hospital?: Partial<HospitalType>;
  doctor: DoctorType;
  appointmentDate: string;
  createdAt: string;
  status: string;
};
