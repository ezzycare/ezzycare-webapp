import { type Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { type DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { ConsultationType } from '@/apiQuery/hospital/types';
import { create } from 'zustand';

export type AppointmentTimes = {
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
};

export type DoctorFiltersType = {
  categoryId?: number | undefined;
  type?: ConsultationType | undefined;
  search?: string | undefined;
  rating?: number | undefined;
  countryId?: number | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  distance?: number | undefined;
};

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
  doctors: Record<number, DoctorProfile>;

  selectedSpecialty: string;
  selectedCareType: 0 | 1;
  selectedCareMode: string;
  reason: string;
  promoCode: string;
  clickedDoctor: Doctor | null;
  selectedAppointmentType: 0 | 1;
  selectedConsultationType: ConsultationType;
  selectedTimes: AppointmentTimes | null;
  activeFilters: DoctorFiltersType;
  state: string;

  updateBooking: (payload: Partial<BookAppointmentStore>) => void;
  setDoctors: (doctors: Record<number, DoctorProfile>) => void;
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
  doctors: {},

  selectedSpecialty: '',
  selectedCareType: 0,
  selectedCareMode: '',
  reason: '',
  promoCode: '',
  clickedDoctor: null,
  selectedAppointmentType: 1,
  selectedConsultationType: 'VIDEO' as ConsultationType,
  selectedTimes: null,
  activeFilters: {},
  state: 'select-specialty',

  updateBooking: (payload) =>
    set((state) => ({
      ...state,
      ...payload,
    })),
  setDoctors: (doctors) => set({ doctors }),
}));
