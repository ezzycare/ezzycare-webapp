'use client';

// import { redirect } from 'next/navigation';
import { useGetHospitalDashboard } from '@/apiQuery/hospital/dashboard';
import AlertBanner from '@/components/Base/AlertBanner';
import {
  CalendarIconLocal,
  StethoscopeIconLocal,
  UsersIconLocal,
} from '@/icons/DashboardNavIcons';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { BookingType } from '@/types/bookings';
import { HospitalType } from '@/types/hospitals';
import { ArrowRight, Banknote } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import BookingTable from '../Booking/BookingTable';
import IconBase from '../IconBase';
import EmptyAppointment from './EmptyAppointment';
import HospitalDetailsModal from './HospitalDetailsModal';

interface Totals {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  timeRange?: string[];
}

const hospital: HospitalType = {
  id: 1,
  name: 'Metropolitan Health Institute',
  email: 'Mhi@gmail.com',
  phoneNumber: '08169192646',
  address: 'Highlevel, Makurdi, Benue State',
  status: 'active',
};

const HospitalAdminDashboard = () => {
  const { dashboard: dashboardData } = useGetHospitalDashboard();
  const user = useAuthStore((state: AuthStore) => state.user);

  const [timeRange, setTimeRange] = React.useState([
    {
      title: '24h',
      active: true,
    },
    {
      title: '7d',
      active: false,
    },
    {
      title: '30d',
      active: false,
    },
  ]);

  const totals: Totals[] = [
    {
      title: 'Total Appointments',
      value: dashboardData?.totalAppointments || 0,
      icon: <CalendarIconLocal className="text-text" />,
    },
    {
      title: 'Total Patients',
      value: dashboardData?.totalPatients || 0,
      icon: <UsersIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Pending Appointments',
      value: dashboardData?.pendingAppointments || 0,
      icon: <CalendarIconLocal className="text-warning-10" />,
    },
    {
      title: 'Revenue',
      value: dashboardData?.revenue || 0,
      icon: <Banknote size={18} className="text-green-10" />,
      timeRange: timeRange.map((item) => item.title),
    },
  ];

  const doctorStats = [
    {
      title: 'Total Doctors',
      value: dashboardData?.totalDoctors || 0,
      icon: <StethoscopeIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Available Doctors',
      value: dashboardData?.availableDoctors || 0,
      icon: <StethoscopeIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Doctors in session',
      value: dashboardData?.doctorsInSession || 0,
      icon: <StethoscopeIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Unavailable Doctors',
      value: dashboardData?.unavailableDoctors || 0,
      icon: <StethoscopeIconLocal className="text-blue-10a" />,
    },
  ];

  const [showProfileModal, setShowProfileModal] = React.useState(false);

  const handleSetTimeRange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange((time) =>
      time
        .map((t) => ({ ...t, active: false }))
        .map((t) => ({
          ...t,
          active: t.title === e.target.value,
        }))
    );
  };

  return (
    <div className="p-7.5 w-full">
      {user && user?.status === 'PROFILE_NOT_COMPLETE' && (
        <AlertBanner
          type="info"
          title="Complete Hospital Profile & Brand Setup"
          content="Complete your hospital profile and brand setup to get discovered by more patients"
          btnText="Complete profile"
          btnIcon={<ArrowRight size={16} className="text-white" />}
          btnAction={() => {
            setShowProfileModal(true);
          }}
        />
      )}
      <h1 className="text-muted text-[28px] font-medium mb-4 mt-2">
        Welcome back,{' '}
        <span className="text-text">Metropolitan Health Institute</span>
      </h1>
      <p>Here&apos;s what is happening on the platform today...</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 justify-between items-center">
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <IconBase>{item.icon}</IconBase>
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-between w-full">
                <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                  {item.title}
                </h2>
                {item.timeRange && (
                  <select
                    className="text-xs text-text-muted font-semibold font-500 bg-gray-3 p-1 rounded-sm"
                    defaultValue={item.timeRange[0]}
                    onChange={handleSetTimeRange}
                  >
                    {item.timeRange.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                )}
              </div>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6.5">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-text font-semibold mb-4.5">Doctors</h2>
          <Link href="/dashboard/doctors">
            <p className="text-primary text-sm font-medium cursor-pointer">
              View all
            </p>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-4 justify-between items-center">
          {doctorStats.map((item) => (
            <div
              key={item.title}
              className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
            >
              <IconBase>{item.icon}</IconBase>
              <div className="flex flex-col gap-2">
                <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                  {item.title}
                </h2>
                <p className="text-text font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-surface-card min-h-97.5">
        <div className="flex items-center gap-2 px-5.5 pt-6.5">
          <CalendarIconLocal className="text-text" />
          <h2 className="text-text font-semibold">Todays Appointments</h2>
          {!!bookings?.length && (
            <Link href="/dashboard/appointments" className="ml-auto">
              <p className="text-primary text-sm font-medium cursor-pointer">
                View all appointments
              </p>
            </Link>
          )}
        </div>
        <div className="-mt-3">
          {!bookings?.length && <EmptyAppointment />}
          {!!bookings?.length && <BookingTable data={bookings.slice(0, 10)} />}
        </div>
      </div>
      <HospitalDetailsModal
        openModal={showProfileModal}
        setOpenModal={setShowProfileModal}
        data={hospital}
      />
    </div>
  );
};

export default HospitalAdminDashboard;

const getStatus = (): string => {
  const rand = Math.random();

  if (rand < 0.5) return 'cancelled';
  if (rand < 0.8) return 'upcoming';
  if (rand < 0.6) return 'active';
  return 'completed';
};

const bookings: BookingType[] = Array.from({ length: 30 }, (_, i) => ({
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
