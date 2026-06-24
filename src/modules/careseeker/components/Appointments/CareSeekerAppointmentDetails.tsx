'use client';

import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import {
  GetSingleAppointmentType,
  useGetAppointmentQuery,
} from '@/apiQuery/healthcareAppointments/get/getSingleAppointment';
import { useCancelAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { ChatIconLocal, ClockIconLocal } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import VideoCallModal from '@/modules/video/VideoCallModal';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { useCallStore } from '@/stores/call-store';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import dayjs from 'dayjs';
import {
  ArrowLeft,
  Briefcase,
  Edit,
  NotepadText,
  SquarePlay,
  Star,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import CancelBookingModal from './CancelBookingModal';
import RescheduleAppointment from './RescheduleAppointment';

const CareSeekerAppointmentDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [openRescheduleModal, setOpenRescheduleModal] = React.useState(false);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    React.useState(false);
  const [joiningVideo, setJoiningVideo] = useState(false);
  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );
  const { active: callOpen, setIncomingCall, clearCall } = useCallStore();
  const { updateBooking } = useBookAppointmentStore();
  const {
    appointment: appointmentData,
    isFetching,
    refetch,
  } = useGetAppointmentQuery({ id });

  const appointment = useMemo(() => {
    return appointmentData ? appointmentData : ({} as GetSingleAppointmentType);
  }, [appointmentData]);

  const shouldPoll =
    appointmentData?.status === 'UPCOMING' &&
    !appointmentData?.roomName &&
    appointmentData?.appointmentType === 'VIDEO';

  useEffect(() => {
    if (!shouldPoll) return;
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, [shouldPoll, refetch]);

  const hasRoomName = !!appointment.roomName;
  const hasToken = !!appointment.seekerToken;
  const isVideoAppointment = appointment.appointmentType === 'VIDEO';
  const canJoinVideo =
    (appointment.status === 'UPCOMING' ||
      appointment.status === 'IN_PROGRESS') &&
    isVideoAppointment;
  const canShowEditButton = appointment.status === 'PENDING';

  const peerName = useMemo(() => {
    const first = appointment?.user?.firstName ?? '';
    const last = appointment?.user?.lastName ?? '';
    return `${first} ${last}`.trim() || 'Unknown';
  }, [appointment]);

  const handleJoinVideoCall = async () => {
    if (hasRoomName && hasToken) {
      setIncomingCall({
        roomName: appointment.roomName!,
        token: appointment.seekerToken!,
        uid: appointment.seekerUid ?? appointment.userId,
        role: 'seeker',
        callerName: peerName,
      });
      return;
    }

    setJoiningVideo(true);
    const result = await refetch();
    setJoiningVideo(false);

    const data = result.data?.data;

    if (data?.roomName && data?.seekerToken) {
      setIncomingCall({
        roomName: data.roomName,
        token: data.seekerToken, // ✅ now aligned
        uid: data.seekerUid ?? appointment.userId,
        role: 'seeker',
        callerName: peerName,
      });
    } else {
      toaster.info('Waiting for the doctor to start the consultation');
    }
  };

  const specialty = useMemo(() => {
    return categories.find((item) =>
      [item.id, item.parentId].includes(appointment?.user?.categoryId || '')
    );
  }, [categories, appointment]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: appointment?.userId,
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
    <>
      {isFetching && (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <SpiralLoader />
        </div>
      )}
      {!isFetching && (
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
                <h3 className="text-text text-2xl font-medium">
                  Booking Details
                </h3>
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
            {!canJoinVideo && canShowEditButton && (
              <EditDetailsBtn
                appointment={appointment}
                setOpenCancelBookingModal={setOpenCancelBookingModal}
                setOpenRescheduleModal={setOpenRescheduleModal}
              />
            )}
            {canJoinVideo && (
              <div className="flex items-center ml-auto gap-2">
                <Button
                  variant="outline"
                  className="min-w-38 text-sm text-text-alt! bg-gray-3a py-2! px-4! gap-2 border-none"
                  onClick={() =>
                    router.push(
                      `/dashboard/messages?peerId=${appointment.userId}&peerName=${encodeURIComponent(
                        appointment.user?.firstName
                          ? `${appointment.user.firstName} ${appointment.user.lastName}`
                          : ''
                      )}`
                    )
                  }
                >
                  <ChatIconLocal />
                  Chat
                </Button>
                {hasRoomName ? (
                  <Button
                    variant="outline"
                    className="text-error! bg-error-3a py-2! px-4! gap-2 border-none"
                    onClick={handleJoinVideoCall}
                  >
                    <SquarePlay size={16} />
                    Join video call
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-amber-11! bg-amber-3a py-2! px-4! gap-2 border-none"
                    onClick={handleJoinVideoCall}
                    loading={joiningVideo}
                  >
                    <SquarePlay size={16} />
                    {joiningVideo ? 'Checking...' : 'Join video call'}
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
                  <h3 className="text-text text-sm font-medium">
                    Booking created
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <CalendarIconLocal className="text-text-alt " />
                    <p className="text-text-muted">
                      {dayjs(appointment?.createdAt).format(
                        'dddd, MMMM DD, YYYY'
                      )}
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
                      <Star size={14} /> {(doctor?.rating || 0).toFixed(1)}{' '}
                      Ratings
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
                    <p className="text-text-muted ml-2">
                      {appointment?.reason}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {canJoinVideo && (
            <EditDetailsBtn
              appointment={appointment}
              setOpenCancelBookingModal={setOpenCancelBookingModal}
              setOpenRescheduleModal={setOpenRescheduleModal}
            />
          )}
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
          {callOpen && hasRoomName && hasToken && (
            <VideoCallModal open={callOpen} onClose={clearCall} />
          )}
        </div>
      )}
    </>
  );
};

export default CareSeekerAppointmentDetails;

const EditDetailsBtn = ({
  setOpenCancelBookingModal,
  setOpenRescheduleModal,
  appointment,
}: {
  setOpenCancelBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRescheduleModal: React.Dispatch<React.SetStateAction<boolean>>;
  appointment: GetSingleAppointmentType;
}) => {
  return (
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
  );
};
