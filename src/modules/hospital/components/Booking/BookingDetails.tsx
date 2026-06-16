'use client';

import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { ClockIconLocal } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  StethoscopeIconLocal,
  UserIconLocal,
} from '@/icons/DashboardNavIcons';
import { BookingType } from '@/types/bookings';
import {
  ArrowLeft,
  Briefcase,
  Edit,
  MessageCircleMore,
  NotepadText,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import RescheduleBookingModal from './RescheduleBookingModal';

const BookingDetails = ({ booking }: { booking: BookingType }) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [previousRoute, setPreviousRoute] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const prev = sessionStorage.getItem('previousRoute');
    setPreviousRoute(prev);
  }, []);

  const isAppointments = previousRoute?.includes('appointments');
  const isAnalytics = previousRoute?.includes('analytics');

  return (
    <div>
      <Link
        href={previousRoute || '/dashboard/bookings'}
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-text-alt" />
        <p className="text-sm text-text-alt">
          Back to{' '}
          <span className="capitalize">
            {isAppointments
              ? 'appointments'
              : isAnalytics
                ? 'analytics'
                : 'bookings'}
          </span>
        </p>
      </Link>

      <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-text text-2xl font-medium">Booking Details</h3>
            <StatusText value={booking.status} />
          </div>

          <div className="flex items-center gap-2.5 mt-3 text-sm">
            <div className="flex items-center gap-1.5 mt-1.5">
              <Briefcase size={18} className="text-text-alt" />
              <p className="text-text-alt text-sm">Booking ID: A001</p>
            </div>
          </div>
        </div>
        {!isAnalytics && (
          <div className="flex items-center ml-auto gap-2">
            {!isAppointments && (
              <>
                <Button
                  variant="outline"
                  className="text-text! hover:text-surface-card! py-2! px-4!"
                  onClick={() => {}}
                >
                  Cancel booking
                </Button>
                <Button
                  variant="outline"
                  className="text-text! hover:text-surface-card! py-2! px-4!"
                  onClick={() => {}}
                >
                  Reschedule booking
                </Button>
              </>
            )}
            {isAppointments && (
              <Button
                variant="primary"
                className="bg-accent-3a! text-accent-11a! gap-2"
              >
                <Edit size={16} />
                Log follow-up details
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-start">
        <div className="rounded-xl border border-gray-5 p-5">
          <div className="flex items-center gap-1.5 mt-1.5">
            <CalendarIconLocal className="text-text-alt " />
            <h3 className="text-text text-lg font-medium">
              Appointment Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 mt-5 items-center justify-between">
            <div>
              <h3 className="text-text text-sm font-medium">Date</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarIconLocal className="text-text-alt " />
                <p className="text-text-muted">Friday, May 08, 2026</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Email</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <ClockIconLocal className="text-text-alt " />
                <p className="text-text-muted">10:00 AM - 10:20 AM</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Booking created</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarIconLocal className="text-text-alt " />
                <p className="text-text-muted">Friday, May 08, 2026</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">
                Consultation type
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <NotepadText size={18} className="text-text-muted " />
                <p className="text-text-muted">Clinic consultation</p>
              </div>
            </div>
            <div className="col-span-2">
              <h3 className="text-text text-sm font-medium">
                Reason for booking
              </h3>
              <div className="flex p-3 min-h-17.5 border border-border2 mt-1.5 rounded-lg w-full">
                <p className="text-text-muted ml-2">Clinic consultation</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Hospital</h3>
              <div className="flex items-center mt-1.5 gap-2">
                <HospitalIconLocal size={16} className="text-text-muted" />
                <p className="text-text-muted">City General Hospital</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-gray-5 p-5">
            <div className="flex items-center gap-1.5 mt-1.5">
              <StethoscopeIconLocal className="text-text-alt " />
              <h3 className="text-text text-lg font-medium">Doctor</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 mt-5 items-center justify-between">
              <div>
                <h3 className="text-text text-sm font-medium">Name</h3>
                <p className="text-text-muted">{booking.doctor.name}</p>
              </div>
              <div>
                <h3 className="text-text text-sm font-medium">Specialty</h3>
                <p className="text-text-muted">{booking.doctor.specialty}</p>
              </div>
              {!isAnalytics && (
                <div>
                  {isAppointments ? (
                    <button
                      className="flex items-center gap-1.5 bg-gray-3a py-1.5 px-3 rounded-lg w-fit cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/dashboard/messages?peerId=${booking.doctor.id}`
                        )
                      }
                    >
                      <MessageCircleMore size={16} className="text-text-alt" />
                      <p className="text-text-alt text-sm">
                        Follow-up with Doctor
                      </p>
                    </button>
                  ) : (
                    <Button
                      variant="outline"
                      className="py-1! px-2.5! text-text! hover:text-surface-card! w-fit"
                      onClick={() => {}}
                    >
                      Reassign Doctor
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-xl border border-gray-5 p-5">
            <div className="flex items-center gap-1.5 mt-1.5">
              <UserIconLocal className="text-text-alt " />
              <h3 className="text-text text-lg font-medium">Patient</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 mt-5 items-start justify-between">
              <div>
                <h3 className="text-text text-sm font-medium">Name</h3>
                <p className="text-text-muted">{booking.patientName}</p>
              </div>
              <div>
                <h3 className="text-text text-sm font-medium">Email</h3>
                <p className="text-text-muted">{`jsmith@gmail.com`}</p>
              </div>
              {!isAnalytics && (
                <button className="flex items-center gap-1.5 bg-gray-3a py-1.5 px-3 rounded-lg w-fit cursor-pointer">
                  <MessageCircleMore size={16} className="text-text-alt" />
                  <p className="text-text-alt text-sm">
                    {previousRoute?.includes('appointment')
                      ? 'Follow-up with Patient'
                      : 'Text Patient'}
                  </p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <RescheduleBookingModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
    </div>
  );
};

export default BookingDetails;
