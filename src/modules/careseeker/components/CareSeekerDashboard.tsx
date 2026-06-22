/* eslint-disable react-hooks/set-state-in-effect */
'use client';

// import { redirect } from 'next/navigation';
import {
  type AppointmentListType,
  type AppointmentStatus,
  useGetAppointmentsInfiniteQuery,
} from '@/apiQuery/healthcareAppointments/get/getAppointments';
import AlertBanner from '@/components/Base/AlertBanner';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import { BoldWalletIcon, DashboardStarsIcon } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import EmptyAppointment from '@/modules/hospital/components/EmptyAppointment';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { debounce, formatCurrency } from '@/utils/helper';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import AppointmentFilterModal from './Appointments/AppointmentFilterModal';
import CareSeekerAppointmentsTable from './Appointments/CareSeekerAppointmentsTable';
import BioDetailsModal from './BioDetailsModal';
import BookDoctorAppointment from './BookAppointment';
import BookHospitalAppointment from './BookHospitalAppointment';

const CareSeekerDashboard = () => {
  const user = useAuthStore((state: AuthStore) => state.user);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showBookDoctorModal, setShowBookDoctorModal] = React.useState(false);
  const [showBookHospitalModal, setShowBookHospitalModal] =
    React.useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<{
    search?: string;
    type?: AppointmentListType;
    status?: AppointmentStatus;
  }>({
    search: '',
    status: 'UPCOMING',
  });

  const debouncedSetFilters = useRef(
    debounce((value: string) => {
      setFilters((prev) => ({
        ...prev,
        search: value,
      }));
    }, 500)
  ).current;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSetFilters(value);
  };

  const { isHospitalAppointment, updateBooking, setIsHospitalAppointment } =
    useBookAppointmentStore();

  const { appointments, isFetching: isLoadingAppointments } =
    useGetAppointmentsInfiniteQuery({
      limit: 10,
      ...filters,
    });

  useEffect(() => {
    const storedShowBalance = localStorage.getItem('showCareSeekerBalance');

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

        <div className="w-full sm:w-fit flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for doctors or hospitals"
            className="w-full sm:max-w-80! rounded-xl! h-10!"
            inputClassName="text-xs!"
            onClear={() => handleSearch('')}
            onOpenFilter={() => setShowFilterModal(true)}
          />

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-1/2 sm:w-auto gap-2 h-10! text-sm"
              onClick={() => {
                updateBooking({
                  state: isHospitalAppointment
                    ? 'book-appointment'
                    : 'select-specialty',
                });
                setShowBookDoctorModal(true);
              }}
            >
              <StethoscopeIconLocal />
              Doctors
            </Button>
            <Button
              variant="primary"
              className="w-1/2 sm:w-auto bg-pink-10! hover:bg-pink-10/80! gap-2 h-10! text-sm"
              onClick={() => {
                updateBooking({ state: 'book-appointment' });
                setShowBookHospitalModal(true);
              }}
            >
              <HospitalIconLocal />
              Hospitals
            </Button>
          </div>
        </div>
      </div>
      {user && user?.status === 'PROFILE_NOT_COMPLETE' && (
        <div className="w-full mt-5">
          <AlertBanner
            type="info"
            title="Complete Hospital Profile"
            content="To fully enjoy your experience on EzzyCare"
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
              {showBalance
                ? formatCurrency(user.walletBalance || 0)
                : '*********'}
            </h2>
          </div>

          <div className="ml-auto text-text" onClick={handleShowBalance}>
            {showBalance ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
          </div>
        </div>

        <div>
          <DashboardStarsIcon className="w-20 sm:w-auto" />
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-surface-card min-h-97.5">
        <div className="flex items-center gap-2 px-5.5 pt-6.5">
          <CalendarIconLocal className="text-text" />
          <h2 className="text-text font-semibold">Upcoming Appointments</h2>
          {!!appointments?.length && (
            <Link href="/dashboard/appointments" className="ml-auto">
              <p className="text-primary text-sm font-medium cursor-pointer whitespace-nowrap">
                View all
              </p>
            </Link>
          )}
        </div>
        {isLoadingAppointments && (
          <div className="w-full h-full flex items-center justify-center">
            <SpiralLoader />
          </div>
        )}
        {!isLoadingAppointments && (
          <div className="-mt-3">
            {!appointments?.length && (
              <EmptyAppointment>
                <Button variant="primary">Book Appointment</Button>
              </EmptyAppointment>
            )}
            <div className="max-w-full overflow-x-auto">
              {!!appointments?.length && (
                <CareSeekerAppointmentsTable data={appointments} />
              )}
            </div>
          </div>
        )}
      </div>
      <AppointmentFilterModal
        open={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(applied) => setFilters((prev) => ({ ...prev, ...applied }))}
        initialType={filters.type}
        initialStatus={filters.status}
      />
      <BioDetailsModal
        openModal={showProfileModal}
        setOpenModal={setShowProfileModal}
        data={user}
      />
      <BookDoctorAppointment
        openModal={showBookDoctorModal}
        setOpenModal={setShowBookDoctorModal}
      />
      <BookHospitalAppointment
        openModal={showBookHospitalModal}
        setOpenModal={setShowBookHospitalModal}
        continueAppointment={() => {
          setIsHospitalAppointment(true);
          setShowBookHospitalModal(false);
          setShowBookDoctorModal(true);
        }}
      />
    </div>
  );
};

export default CareSeekerDashboard;
