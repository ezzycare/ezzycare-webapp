import { DoctorType } from './doctors';

export type BookingType = {
  id: number;
  bookingId: string;
  patientName: string;
  doctor: DoctorType;
  appointmentDate: string;
  createdAt: string;
  status: string;
};
