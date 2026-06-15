'use client';

import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import { GetSingleAppointmentType } from '@/apiQuery/healthcareAppointments/get/getSingleAppointment';
import { useCancelAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { ClockIconLocal } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import dayjs from 'dayjs';
import { ArrowLeft, Briefcase, Edit, NotepadText, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import CancelBookingModal from './CancelBookingModal';
import RescheduleAppointment from './RescheduleAppointment';

const AppointmentDetails = ({
  appointment,
}: {
  appointment: GetSingleAppointmentType;
}) => {
  const router = useRouter();
  const [openRescheduleModal, setOpenRescheduleModal] = React.useState(false);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    React.useState(false);
  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );
  const { updateBooking } = useBookAppointmentStore();

  const specialty = useMemo(() => {
    return categories.find((item) =>
      [item.id, item.parentId].includes(appointment?.user?.categoryId || '')
    );
  }, [categories, appointment]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: appointment?.user?.id || '',
    });

  const doctor = useMemo(() => {
    return doctorData ? doctorData : ({} as DoctorProfile);
  }, [doctorData]);

  const { mutate: cancelAppointment, isPending } =
    useCancelAppointmentMutation();

  const handleOpenRescheduleModal = () => {
    if (openRescheduleModal) {
      setOpenRescheduleModal(false);
      return;
    }
    updateBooking({
      state: 'book-appointment',
      selectedSpecialty: specialty?.id,
      selectedCareType: appointment?.urgent as 0 | 1,
      selectedCareMode: appointment?.appointmentType,
      reason: appointment?.reason,
      clickedDoctor: doctor,
      createdAppointment: appointment,
      selectedAppointmentType: appointment?.myAppointment as 0 | 1,
      selectedConsultationType: appointment?.appointmentType,
      selectedTimes: {
        appointmentDate: dayjs(appointment?.appointmentDate).format(
          'YYYY-MM-DD'
        ),
        appointmentTime: dayjs(appointment?.appointmentTime).format('HH:mm A'),
        appointmentEndTime: dayjs(appointment?.appointmentEndTime).format(
          'HH:mm A'
        ),
      },
    });

    setOpenRescheduleModal(true);
  };

  const handleCancelAppointment = (reason: string) => {
    cancelAppointment(
      {
        id: appointment.id!,
        reason,
      },
      {
        onSuccess: () => {
          setOpenCancelBookingModal(false);
        },
      }
    );
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="text-text-alt" />
        <p className="text-sm text-text-alt">Back to booking</p>
      </div>

      <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-text text-2xl font-medium">Booking Details</h3>
            <StatusText value={appointment?.status?.toLowerCase()} />
          </div>

          <div className="flex items-center gap-2.5 mt-3 text-sm">
            <div className="flex items-center gap-1.5 mt-1.5">
              <Briefcase size={18} className="text-text-alt" />
              <p className="text-text-alt text-sm">
                Booking ID: {appointment?.uid}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-auto gap-2">
          {appointment.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              className="text-text! hover:text-surface-card! py-2! px-4!"
              onClick={() => {
                setOpenCancelBookingModal(true);
              }}
            >
              Cancel booking
            </Button>
          )}
          <Button
            variant="outline"
            className="text-text! hover:text-surface-card! py-2! px-4!"
            onClick={() => setOpenRescheduleModal(true)}
          >
            Reschedule booking
          </Button>
        </div>
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
                <p className="text-text-muted">
                  {dayjs(appointment?.appointmentDate).format(
                    'dddd, MMMM DD, YYYY'
                  )}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Email</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <ClockIconLocal className="text-text-alt " />
                <p className="text-text-muted">{`${appointment?.appointmentTime} - ${appointment?.appointmentEndTime}`}</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Booking created</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarIconLocal className="text-text-alt " />
                <p className="text-text-muted">
                  {dayjs(appointment?.createdAt).format('dddd, MMMM DD, YYYY')}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">
                Consultation type
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <NotepadText size={18} className="text-text-muted " />
                <p className="text-text-muted capitalize">
                  {appointment.appointmentType?.toLowerCase()} consultation
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Hospital</h3>
              <div className="flex items-center mt-1.5 gap-2">
                <HospitalIconLocal size={16} className="text-text-muted" />
                <p className="text-text-muted">
                  {appointment?.user?.userDetails?.clinicHospitalName}
                </p>
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
                <p className="text-text-muted">{`
                  ${appointment?.user?.firstName || ''} ${appointment?.user?.lastName || ''}
                `}</p>
              </div>
              <div>
                <h3 className="text-text text-sm font-medium">Specialty</h3>
                <p className="text-text-muted">{specialty?.name || ''}</p>
              </div>
              <div>
                <h3 className="text-text text-sm font-medium">Location</h3>
                <p className="text-text-muted">
                  {appointment?.user?.userDetails?.city}
                </p>
              </div>
              <div className="flex w-full gap-1 items-center mt-3 text-xs">
                <p className="flex items-center gap-1 text-blue-11 bg-accent-3a rounded-md py-1 px-2">
                  <Star size={14} /> {(doctor?.rating || 0).toFixed(1)} Ratings
                </p>
                <p className="flex items-center gap-1 text-plum-11a bg-pink-3a rounded-md py-1 px-2">
                  <Edit size={14} /> {doctor?.reviewCount} Reviews
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gray-5 p-5">
            <div className="col-span-2">
              <h3 className="text-text text-sm font-medium">
                Reason for booking
              </h3>
              <div className="flex p-3 min-h-17.5 border border-border2 mt-1.5 rounded-lg w-full">
                <p className="text-text-muted ml-2">{appointment?.reason}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RescheduleAppointment
        appointment={appointment}
        doctor={doctor}
        openModal={openRescheduleModal}
        setOpenModal={handleOpenRescheduleModal}
      />
      <CancelBookingModal
        openModal={openCancelBookingModal}
        setOpenModal={setOpenCancelBookingModal}
        isLoading={isPending}
        action={handleCancelAppointment}
      />
    </div>
  );
};

export default AppointmentDetails;
