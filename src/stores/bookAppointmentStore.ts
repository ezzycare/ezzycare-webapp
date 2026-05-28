import { create } from 'zustand';

export interface BookAppointmentStore {
  patientName: string;
  patientEmail: string;
  bookingType: 'doctor' | 'hospital';
  consultationType: 'video' | 'home' | 'clinic';
  careType: string;
  specialty: string;
  location: string;
  doctorId: string;
  appointmentDate: string;
  consultationFee: string;
}

export const useBookAppointmentStore = create<BookAppointmentStore>((set) => ({
  patientName: '',
  patientEmail: '',
  bookingType: '' as 'doctor' | 'hospital',
  consultationType: '' as 'video' | 'home' | 'clinic',
  careType: '',
  specialty: '',
  location: '',
  doctorId: '',
  appointmentDate: '',
  consultationFee: '',
}));
