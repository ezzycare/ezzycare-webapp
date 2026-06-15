import { type Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { type DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { CreateAppointmentInterface } from '@/apiQuery/healthcareAppointments/post/createAppointment';
import { HospitalDiscoveryItem } from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import { ConsultationType } from '@/apiQuery/hospital/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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

export type HospitalFiltersType = {
  services?: string | undefined;
  search?: string | undefined;
};

export type PaymentReference = {
  access_code: string;
  authorization_url: string;
  reference: string;
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
  createdAppointment: CreateAppointmentInterface | null;
  paymentReference: PaymentReference | null;

  hospitalId: number | null;
  hospitalState: string;
  isHospitalAppointment: boolean;
  clickedHospital: HospitalDiscoveryItem | null;
  activeHospitalFilters: HospitalFiltersType;

  updateHospitalState: (state: string) => void;
  updateBooking: (payload: Partial<BookAppointmentStore>) => void;
  setDoctors: (doctors: Record<number, DoctorProfile>) => void;
  setCreatedAppointment: (
    appointment: CreateAppointmentInterface | null
  ) => void;
  updatePaymentReference: (paymentReference: PaymentReference | null) => void;
  setIsHospitalAppointment: (isHospital: boolean) => void;
  resetBookingFlow: () => void;
  resetHospitalFlow: () => void;
  resetPaymentState: () => void;
}

const bookingInitialState = {
  patientName: '',
  patientEmail: '',
  bookingType: null,
  consultationType: null,
  urgent: 0 as 0 | 1,
  specialty: '',
  location: '',
  doctorId: '',
  appointmentDate: '',
  consultationFee: '',
  selectedSpecialty: '',
  selectedCareType: 0 as 0 | 1,
  selectedCareMode: '',
  reason: '',
  promoCode: '',
  clickedDoctor: null,
  selectedAppointmentType: 1 as 0 | 1,
  selectedConsultationType: 'VIDEO' as ConsultationType,
  selectedTimes: null,
  activeFilters: {},
};

const hospitalInitialState = {
  hospitalId: null,
  hospitalState: 'select-hospital',
  isHospitalAppointment: false,
  clickedHospital: null,
  activeHospitalFilters: {},
};

const paymentInitialState = {
  createdAppointment: null,
  paymentReference: null,
};

export const useBookAppointmentStore = create<BookAppointmentStore>()(
  devtools(
    (set) => ({
      state: 'select-specialty',
      ...bookingInitialState,
      ...hospitalInitialState,
      ...paymentInitialState,

      updateBooking: (payload) =>
        set((state) => ({
          ...state,
          ...payload,
        })),
      updateHospitalState: (state) => set({ hospitalState: state }),
      setDoctors: (doctors) => set({ doctors }),
      setCreatedAppointment: (appointment) =>
        set({ createdAppointment: appointment }),
      updatePaymentReference: (payload) => set({ paymentReference: payload }),
      setIsHospitalAppointment: (isHospital) =>
        set({ isHospitalAppointment: isHospital }),
      resetBookingFlow: () => set({ ...bookingInitialState }),

      resetHospitalFlow: () =>
        set({
          ...hospitalInitialState,
        }),

      resetPaymentState: () =>
        set({
          ...paymentInitialState,
        }),
    }),
    {
      name: 'bookAppointmentStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
