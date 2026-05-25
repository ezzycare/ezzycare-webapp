/* eslint-disable @typescript-eslint/no-explicit-any */

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

export const useBookAppointmentStore = (set: any, get?: any) => ({
  patientName: '',
  patientEmail: '',
  bookingType: '',
  consultationType: '',
  careType: '',
  specialty: '',
  location: '',
  doctorId: '',
  appointmentDate: '',
  consultationFee: '',
});
