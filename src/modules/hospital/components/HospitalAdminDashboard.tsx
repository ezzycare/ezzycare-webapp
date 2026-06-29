'use client';

import { useGetHospitalDashboard } from '@/apiQuery/hospital';
import { useGetHospitalAppointments } from '@/apiQuery/hospital/get/getAppointments';
import AlertBanner from '@/components/Base/AlertBanner';
import IconBase from '@/components/layout/IconBase';
import {
  CalendarIconLocal,
  StethoscopeIconLocal,
  UsersIconLocal,
} from '@/icons/DashboardNavIcons';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { Banknote } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import HospitalAppointmentTable from './Booking/HospitalAppointmentTable';
import EmptyAppointment from './EmptyAppointment';
import HospitalDetailsModal from './HospitalDetailsModal';
interface Totals {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  timeRange?: string[];
}

const HospitalAdminDashboard = () => {
  const { dashboard: dashboardData } = useGetHospitalDashboard();
  const { appointments: rawAppointments, isLoading: appointmentsLoading } =
    useGetHospitalAppointments();
  const hospitalUser = useAuthStore((state: AuthStore) => state.hospitalUser);

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

  const [showProfileModal, setShowProfileModal] = React.useState(true);

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

  const appointments = useMemo(
    () => (rawAppointments?.length ? rawAppointments : []),
    [rawAppointments]
  );

  return (
    <div className="p-7.5 w-full">
      {hospitalUser && !hospitalUser?.profileCompleted && (
        <AlertBanner
          type="info"
          title="Complete Hospital Profile & Brand Setup"
          content="Complete your hospital profile and brand setup to get discovered by more patients"
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
          {!!appointments?.length && (
            <Link href="/dashboard/appointments" className="ml-auto">
              <p className="text-primary text-sm font-medium cursor-pointer">
                View all appointments
              </p>
            </Link>
          )}
        </div>
        <div className="-mt-3">
          {!appointmentsLoading && !appointments?.length && (
            <EmptyAppointment />
          )}
          {!!appointments?.length && (
            <HospitalAppointmentTable data={appointments.slice(0, 10)} />
          )}
        </div>
      </div>
      <HospitalDetailsModal
        openModal={showProfileModal}
        setOpenModal={setShowProfileModal}
        data={hospitalUser}
      />
    </div>
  );
};

export default HospitalAdminDashboard;
