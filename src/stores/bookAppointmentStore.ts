import { ConsultationType } from '@/apiQuery/hospital/types';
import { create } from 'zustand';

export interface BookAppointmentStore {
  patientName: string;
  patientEmail: string;
  bookingType: 'doctor' | 'hospital' | null;
  consultationType: ConsultationType | null;
  urgent: number;
  specialty: string;
  location: string;
  doctorId: string;
  appointmentDate: string;
  consultationFee: string;

  updateBooking: (payload: Partial<BookAppointmentStore>) => void;
}

export const useBookAppointmentStore = create<BookAppointmentStore>((set) => ({
  patientName: '',
  patientEmail: '',
  bookingType: null,
  consultationType: null,
  urgent: 0,
  specialty: '',
  location: '',
  doctorId: '',
  appointmentDate: '',
  consultationFee: '',

  updateBooking: (payload) =>
    set((state) => ({
      ...state,
      ...payload,
    })),
}));
