/* eslint-disable react-hooks/set-state-in-effect */
'use client';

// import { redirect } from 'next/navigation';
import { useGetDoctorAppointmentsInfiniteQuery } from '@/apiQuery/doctor/appointments/getAppointments';
import { useGetHospitalInvitationsQuery } from '@/apiQuery/doctor/profile/getHospitalInvitations';
import AlertBanner from '@/components/Base/AlertBanner';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import {
  BoldWalletIcon,
  DashboardStarsIcon,
  DoctorAppointmentsIcon,
} from '@/icons/DashboardIcons';
import { CalendarIconLocal } from '@/icons/DashboardNavIcons';
import EmptyAppointment from '@/modules/hospital/components/EmptyAppointment';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { formatCurrency } from '@/utils/helper';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import AppointmentRequestCard from './Appointments/AppointmentRequestCard';
import DoctorAppointmentsTable from './Appointments/DoctorAppointmentsTable';
import SetAvailabilityModal from './Availability/SetAvailabilityModal';
import CompleteDoctorProfileModal from './CompleteDoctorProfileModal';
import HospitalInvitationCard from './Invitation/HospitalInvitationCard';
import { HospitalWelcomeModal } from './Invitation/HospitalWelcomeModal';
import UploadDoctorDocs from './UploadDoctorDocs';

const DoctorDashboard = () => {
  const user = useAuthStore((state: AuthStore) => state.doctorUser);
  const [showBalance, setShowBalance] = useState(true);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const [showUploadDocsModal, setShowUploadDocsModal] = React.useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] =
    React.useState(false);
  const [showPendingAppointment, setShowPendingAppointment] =
    React.useState(true);
  const [showHospitalWelcomeModal, setShowHospitalWelcomeModal] =
    React.useState(false);

  const {
    appointments,
    isFetching: isLoadingAppointments,
    totalAppointments,
  } = useGetDoctorAppointmentsInfiniteQuery({
    limit: 20,
  });

  const upcomingEvents = useMemo(() => {
    return appointments?.length
      ? appointments?.filter((val) =>
          ['UPCOMING', 'IN_PROGRESS'].includes(val.status)
        )
      : [];
  }, [appointments]);

  const paidAppointment = useMemo(() => {
    return appointments?.length
      ? appointments?.find((val) => val.status === 'PAID')
      : null;
  }, [appointments]);

  const { invitations } = useGetHospitalInvitationsQuery();
  const hospitalInvitation = useMemo(() => {
    return invitations?.length ? invitations[0] : null;
  }, [invitations]);

  useEffect(() => {
    const storedShowBalance =
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('showCareSeekerBalance')
        : null;

    setShowBalance(storedShowBalance === 'true');
  }, []);

  const handleShowBalance = () => {
    const value = !showBalance;
    setShowBalance(value);
    localStorage.setItem('showCareSeekerBalance', String(value));
  };

  const renderCards = () => {
    if (hospitalInvitation) {
      return (
        <HospitalInvitationCard
          invitation={hospitalInvitation}
          onClose={() => setShowHospitalWelcomeModal(true)}
        />
      );
    } else if (paidAppointment && showPendingAppointment) {
      return (
        <AppointmentRequestCard
          appointment={paidAppointment}
          onClose={() => setShowPendingAppointment(false)}
        />
      );
    }
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

        {renderCards()}
      </div>
      {user && !user?.profileCompleted && (
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

      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3.75 mt-2.5">
        <div className="w-full sm:w-1/2 flex justify-between items-center bg-blue-3a rounded-xl">
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

            <button
              type="button"
              className="ml-auto text-text"
              onClick={handleShowBalance}
              aria-label={showBalance ? 'Hide balance' : 'Show balance'}
            >
              {showBalance ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
            </button>
          </div>

          <div>
            <DashboardStarsIcon fill="#00BEE233" className="w-20 sm:w-35" />
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex justify-between items-center bg-pink-3a rounded-xl">
          <div className="flex items-center gap-6.25 max-w-68 p-2">
            <DoctorAppointmentsIcon />
            <div>
              <p className="text-xs text-accent-12">Appointments</p>
              <h2 className="text-lg text-blue-12 font-semibold">
                {totalAppointments || 0}
              </h2>
            </div>
          </div>

          <div>
            <DashboardStarsIcon fill="#A036AE33" className="w-20 sm:w-35" />
          </div>
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
            {!upcomingEvents?.length && (
              <EmptyAppointment>
                <>
                  <div className="w-77 flex flex-col mx-auto space-y-3">
                    {!user.profileCompleted && (
                      <Button
                        variant="primary"
                        onClick={() => setShowProfileModal(true)}
                      >
                        Get verified
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-blue-11! text-blue-11!"
                      onClick={() => setShowAvailabilityModal(true)}
                    >
                      Set Availability
                    </Button>
                  </div>
                </>
              </EmptyAppointment>
            )}
            <div className="max-w-full overflow-x-auto">
              {!!upcomingEvents?.length && (
                <DoctorAppointmentsTable data={upcomingEvents} />
              )}
            </div>
          </div>
        )}
      </div>
      <CompleteDoctorProfileModal
        openModal={showProfileModal}
        setOpenModal={() => {
          setShowProfileModal(false);
          setShowUploadDocsModal(true);
        }}
        data={user}
      />
      <UploadDoctorDocs
        openModal={showUploadDocsModal}
        setOpenModal={setShowUploadDocsModal}
        onSuccess={() => {}}
      />
      <SetAvailabilityModal
        open={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        onSave={(availability) => {}}
      />
      <HospitalWelcomeModal
        open={showHospitalWelcomeModal}
        onClose={() => setShowHospitalWelcomeModal(false)}
        onConfirm={() => {
          setShowHospitalWelcomeModal(false);
          setShowProfileModal(true);
        }}
      />
    </div>
  );
};

export default DoctorDashboard;
