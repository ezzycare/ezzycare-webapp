'use client';

// import { redirect } from 'next/navigation';
import AlertBanner from '@/components/Base/AlertBanner';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import { BoldWalletIcon, DashboardStarsIcon } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { BookingType } from '@/types/bookings';
import { HospitalType } from '@/types/hospitals';
import { ArrowRight, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BookingTable from '../Booking/BookingTable';
import EmptyAppointment from '../Hospital/EmptyAppointment';
import BioDetailsModal from './BioDetailsModal';
import BookPatientAppointment from './BookAppointment';

const hospital: HospitalType = {
  id: 1,
  name: 'Metropolitan Health Institute',
  email: 'Mhi@gmail.com',
  phoneNumber: '08169192646',
  address: 'Highlevel, Makurdi, Benue State',
  status: 'active',
};

const CareSeekerDashboard = () => {
  // const { dashboard: dashboardData } = useGetAppointments();
  const user = useAuthStore((state: AuthStore) => state.user);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showBookDoctorModal, setShowBookDoctorModal] = React.useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    const storedShowBalance = localStorage.getItem('showCareSeekerBalance');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBalance(storedShowBalance === 'true');
  }, []);

  const handleShowBalance = () => {
    const value = !showBalance;
    setShowBalance(value);
    localStorage.setItem('showCareSeekerBalance', String(value));
  };

  return (
    <div className="p-7.5 w-full">
      <div className="flex items-center justify-between flex-wrap">
        <div className="text-text-muted">
          <h2>
            Morning,{' '}
            <span className="text-text font-medium">
              {user?.firstName}
            </span>{' '}
          </h2>
          <p className="text-sm">How are you doing today? </p>
        </div>

        <div className="flex gap-3">
          <SearchInput
            value=""
            onChange={() => {}}
            placeholder="Search for doctors or hospitals"
            className="max-w-90! rounded-xl! h-10!"
            inputClassName="text-xs!"
            filters={[
              {
                key: 'specialization',
                label: 'Specialty',
              },
            ]}
            onFilterChange={(filter) => {
              setActiveFilters((prev) =>
                prev.includes(filter.key)
                  ? prev.filter((f) => f !== filter.key)
                  : [...prev, filter.key]
              );
            }}
          />

          <Button
            variant="primary"
            className="gap-2 h-10! text-sm"
            onClick={() => setShowBookDoctorModal(true)}
          >
            <StethoscopeIconLocal />
            Doctors
          </Button>
          <Button
            variant="primary"
            className="bg-pink-10! hover:bg-pink-10/80! gap-2 h-10! text-sm"
          >
            <HospitalIconLocal />
            Hospitals
          </Button>
        </div>
      </div>
      {user && user?.status === 'PROFILE_NOT_COMPLETE' && (
        <div className="w-full mt-5">
          <AlertBanner
            type="info"
            title="Complete Hospital Profile"
            content="To fully enjoy your experience on EzzyCare"
            btnText="Complete profile"
            btnIcon={<ArrowRight size={16} className="text-white" />}
            btnAction={() => {
              setShowProfileModal(true);
            }}
          />
        </div>
      )}
      <div className="flex gap-2 justify-between items-center bg-blue-3a rounded-xl mt-2.5">
        <div className="flex items-center gap-6.25 max-w-68 p-2">
          <BoldWalletIcon />
          <div>
            <p className="text-xs text-accent-12">Available Balance</p>
            <h2 className="text-lg text-blue-12 font-semibold">
              {showBalance ? 'N5,000.00' : '*********'}
            </h2>
          </div>

          <div className="ml-auto text-text" onClick={handleShowBalance}>
            {showBalance ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
          </div>
        </div>

        <div>
          <DashboardStarsIcon />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-surface-card min-h-97.5">
        <div className="flex items-center gap-2 px-5.5 pt-6.5">
          <CalendarIconLocal className="text-text" />
          <h2 className="text-text font-semibold">Upcoming Appointments</h2>
          {!!bookings?.length && (
            <Link href="/dashboard/appointments" className="ml-auto">
              <p className="text-primary text-sm font-medium cursor-pointer">
                View all
              </p>
            </Link>
          )}
        </div>
        <div className="-mt-3">
          {!bookings?.length && (
            <EmptyAppointment>
              <Button variant="primary">Book Appointment</Button>
            </EmptyAppointment>
          )}
          {!!bookings?.length && <BookingTable data={bookings.slice(0, 10)} />}
        </div>
      </div>
      <BioDetailsModal
        openModal={showProfileModal}
        setOpenModal={setShowProfileModal}
        data={hospital}
      />
      <BookPatientAppointment
        openModal={showBookDoctorModal}
        setOpenModal={setShowBookDoctorModal}
      />
    </div>
  );
};

export default CareSeekerDashboard;

const getStatus = (): string => {
  const rand = Math.random();

  if (rand < 0.5) return 'cancelled';
  if (rand < 0.8) return 'upcoming';
  if (rand < 0.6) return 'active';
  return 'completed';
};

const bookings: BookingType[] = Array.from({ length: 0 }, (_, i) => ({
  id: i + 1,
  bookingId: 'B001',
  patientName: 'John Smith',
  doctor: {
    id: i + 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    phoneNumber: '+1 (555) 123-4567',
    assignedHospital: 'Emory',
    experience: (i + 1) * 2 - i + ' years',
    specialty: 'Cardiology',
    createdAt: 'May 08, 2026 10:00 AM',
    status: 'active',
    address: 'Highlevel, Makurdi, Benue State',
    medicalCertificate: 'MD',
    practiceLicense: '12345',
    specialtyCertificate: '12345',
    licenseExpiryDate: '12 May 2035',
    qualifications: ['MD', 'FAAP'],
    university: 'University of California, San Francisco',
    dateGraduated: '12 May 2015',
    about: `Dr. Rodriguez is passionate about child health and development.`,
  },
  appointmentDate: '08069192646',
  createdAt: '2023-01-01',
  address: 'Highlevel, Makurdi, Benue State',
  status: getStatus(),
}));
