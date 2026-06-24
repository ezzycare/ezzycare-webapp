/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useAcceptDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/acceptAppointment';
import { useCancelDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/cancelAppointment';
import { useDeclineDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/declineAppointment';
import { useGetDoctorAppointmentQuery } from '@/apiQuery/doctor/appointments/getAppointment';
import { useStartDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/startAppointment';
import { useSubmitDoctorConsultationNotesMutation } from '@/apiQuery/doctor/appointments/submitConsultationNotes';
import { DoctorAppointment } from '@/apiQuery/doctor/appointments/types';
import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import { useGetSingleHospital } from '@/apiQuery/hospital/discovery/getSingleHospital';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { ChatIconLocal, ClockIconLocal } from '@/icons/DashboardIcons';
import {
  CalendarIconLocal,
  HospitalIconLocal,
  UserIconLocal,
} from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import CancelBookingModal from '@/modules/careseeker/components/Appointments/CancelBookingModal';
import VideoCallModal from '@/modules/video/VideoCallModal';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { useCallStore } from '@/stores/callStore';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ArrowLeft, Briefcase, NotepadText, SquarePlay } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import DoctorRescheduleAppointment from './DoctorRescheduleAppointment';
import { EndConsultationModal } from './EndConsultationModal';
import type { ConsultationNotesFormData } from './PostConsultationNotesModal';
import { PostConsultationNotesModal } from './PostConsultationNotesModal';
import { StartConsultationModal } from './StartConsultationModal';

const DoctorAppointmentDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    if (Number.isNaN(id)) {
      router.replace('/dashboard/appointments');
    }
  }, [id, router]);

  const [openRescheduleModal, setOpenRescheduleModal] = React.useState(false);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    React.useState(false);

  const { updateBooking } = useBookAppointmentStore();
  const {
    appointment: appointmentData,
    isFetching,
    refetch,
  } = useGetDoctorAppointmentQuery({ id });

  const appointment: DoctorAppointment | null | undefined = appointmentData;

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: appointment?.userId ?? null,
    });

  const doctor: DoctorProfile | null | undefined = doctorData;

  const { hospital } = useGetSingleHospital({
    id: appointment?.hospitalId ?? null,
  });

  const { mutate: cancelAppointment, isPending } =
    useCancelDoctorAppointmentMutation();
  const { mutate: acceptAppointment, isPending: isAccepting } =
    useAcceptDoctorAppointmentMutation();
  const { mutate: declineAppointment, isPending: isDeclining } =
    useDeclineDoctorAppointmentMutation();

  const queryClient = useQueryClient();
  const { mutate: startConsultation, isPending: isStartingConsultation } =
    useStartDoctorAppointmentMutation();

  const [startingConsultation, setStartingConsultation] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const {
    active,
    role,
    roomName,
    token,
    uid,
    callerName,
    setCallDetails,
    clearCall,
  } = useCallStore();

  const { mutate: submitNotes, isPending: isSubmittingNotes } =
    useSubmitDoctorConsultationNotesMutation();

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('notes') === '1') {
      setShowNotesModal(true);
    }
  }, [searchParams]);

  const handleSubmitNotes = (data: ConsultationNotesFormData) => {
    submitNotes(
      {
        id: String(id),
        diagnostic: data.diagnostic,
        symptomsObserved: data.symptomsObserved,
        prescription: data.prescription,
        followUpInstructions: data.followUpInstructions ?? '',
      },
      {
        onSuccess: () => {
          toaster.success('Notes submitted');
          setShowNotesModal(false);
          queryClient.invalidateQueries({
            queryKey: ['doctor', 'appointments', id],
          });
          router.replace(`/dashboard/appointments/${id}`);
        },
        onError: () => {
          toaster.error('Failed to submit notes');
        },
      }
    );
  };

  const handleOpenRescheduleModal = () => {
    if (openRescheduleModal) {
      setOpenRescheduleModal(false);
      return;
    }
    updateBooking({
      state: 'book-appointment',
      selectedCareType: appointment?.urgent as 0 | 1,
      selectedCareMode: appointment?.appointmentType,
      reason: appointment?.reason,
      clickedDoctor: doctor,
      createdAppointment: appointment as any,
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
    if (!appointment?.id) return;
    cancelAppointment(
      {
        id: appointment.id,
        reason,
      },
      {
        onSuccess: () => {
          toaster.success('Appointment cancelled successfully');
          setOpenCancelBookingModal(false);
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to cancel appointment');
        },
      }
    );
  };

  const handleStartConsultation = () => {
    setShowStartModal(true);
  };

  const doctorPeerName = useMemo(() => {
    const first = appointment?.client?.firstName ?? '';
    const last = appointment?.client?.lastName ?? '';
    return `${first} ${last}`.trim() || 'Unknown';
  }, [appointment]);

  const handleConfirmStartConsultation = () => {
    if (!appointment?.id) return;
    setShowStartModal(false);
    setStartingConsultation(true);
    startConsultation(
      { id: String(appointment.id) },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['doctor', 'appointments', id],
          });
          toaster.success('Consultation started');

          const responseData = (data as any)?.data?.data ?? (data as any)?.data;
          const roomName =
            responseData?.roomName || appointment!.roomName || '';
          const token =
            responseData?.doctorToken || appointment!.doctorToken || '';
          const uid = responseData?.uid || appointment!.uid;

          if (roomName && token) {
            setCallDetails({
              roomName,
              token: token,
              uid,
              callerName: doctorPeerName,
              role: 'DOCTOR',
              appointmentId: id,
            });
          } else {
            refetch().then((result) => {
              const d = result.data?.data;

              if (d?.roomName && d?.doctorToken) {
                setCallDetails({
                  roomName: d.roomName,
                  token: d.doctorToken,
                  uid: d.uid,
                  callerName: doctorPeerName,
                  role: 'DOCTOR',
                  appointmentId: id,
                });
              } else {
                toaster.info('Video room is being created...');
              }
            });
          }
        },
        onError: () => {
          toaster.error('Failed to start consultation');
        },
        onSettled: () => {
          setStartingConsultation(false);
        },
      }
    );
  };

  return (
    <>
      {isFetching && (
        <div className="w-full h-[50vh] flex items-center justify-center">
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
            <p className="text-sm text-text-alt">Back to Appointments</p>
          </div>

          <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h3 className="text-text text-2xl font-medium">
                  Appointment Details
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
            {appointment?.status === 'UPCOMING' && (
              <EditDetailsBtn
                appointment={appointment!}
                setOpenCancelBookingModal={setOpenCancelBookingModal}
                setOpenRescheduleModal={setOpenRescheduleModal}
                onStartConsultation={handleStartConsultation}
                isStartingConsultation={
                  startingConsultation || isStartingConsultation
                }
              />
            )}
            {appointment?.status === 'PAID' && (
              <div className="flex items-center ml-auto gap-2">
                <Button
                  variant="outline"
                  className="min-w-38 text-sm text-blue-11! border-primary! py-2! px-4!"
                  onClick={() =>
                    declineAppointment(
                      { id: appointment!.id, reason: '' },
                      {
                        onSuccess: () => {
                          toaster.success('Appointment declined');
                          queryClient.invalidateQueries({
                            queryKey: ['doctor', 'appointments'],
                          });
                        },
                        onError: () => {
                          toaster.error('Failed to decline appointment');
                        },
                      }
                    )
                  }
                  disabled={isDeclining || isAccepting}
                  loading={isDeclining}
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  className="min-w-38 py-2! px-4! border-none"
                  onClick={() =>
                    acceptAppointment(
                      { id: String(appointment.id) },
                      {
                        onSuccess: () => {
                          toaster.success('Appointment accepted');
                          queryClient.invalidateQueries({
                            queryKey: ['doctor', 'appointments'],
                          });
                        },
                        onError: () => {
                          toaster.error('Failed to accept appointment');
                        },
                      }
                    )
                  }
                  disabled={isDeclining || isAccepting}
                  loading={isAccepting}
                >
                  Accept
                </Button>
              </div>
            )}
            {appointment?.status === 'IN_PROGRESS' && (
              <Button
                variant="primary"
                className="min-w-38 py-2! px-4! border-none"
                onClick={() => setShowEndModal(true)}
              >
                End Consultation
              </Button>
            )}
            {appointment?.status === 'COMPLETED' && (
              <div className="flex items-center gap-3">
                {!appointment?.consultNotes && (
                  <Button
                    variant="primary"
                    className="min-w-38 text-sm py-2! px-4! gap-2 border-none"
                    onClick={() => setShowNotesModal(true)}
                  >
                    <NotepadText className="w-4 h-4" />
                    Add Notes
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="min-w-38 text-sm text-text-alt! bg-gray-3a py-2! px-4! gap-2 border-none"
                  onClick={() =>
                    router.push(
                      `/dashboard/messages?peerId=${appointment.clientId}&peerName=${encodeURIComponent(
                        appointment.client?.firstName
                          ? `${appointment.client.firstName} ${appointment.client.lastName}`
                          : ''
                      )}`
                    )
                  }
                >
                  <ChatIconLocal />
                  Follow-up
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-start">
            <div className="rounded-xl border border-gray-5 p-5 h-full">
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
                      {appointment?.appointmentType?.toLowerCase()} consultation
                    </p>
                  </div>
                </div>
                {hospital?.hospitalName && (
                  <div>
                    <h3 className="text-text text-sm font-medium">Hospital</h3>
                    <div className="flex items-center mt-1.5 gap-2">
                      <HospitalIconLocal
                        size={16}
                        className="text-text-muted"
                      />
                      <p className="text-text-muted">
                        {hospital?.hospitalName || ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="rounded-xl border border-gray-5 p-5">
                <div className="flex items-center gap-1.5 mt-1.5">
                  <UserIconLocal className="text-text-alt " />
                  <h3 className="text-text text-lg font-medium">
                    Patient Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-10 mt-5 items-center justify-between">
                  <div>
                    <h3 className="text-text text-sm font-medium">Name</h3>
                    <p className="text-text-muted">{`
                  ${appointment?.client?.firstName || ''} ${appointment?.client?.lastName || ''}
                `}</p>
                  </div>
                  <div>
                    <h3 className="text-text text-sm font-medium">
                      Phone Number
                    </h3>
                    <p className="text-text-muted">
                      {appointment?.client?.mobileNo || ''}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-text text-sm font-medium">Email</h3>
                    <p className="text-text-muted">
                      {appointment?.client?.email}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-text text-sm font-medium">
                      Consultation fee
                    </h3>
                    <p className="text-text-muted">{appointment?.hcpFees}</p>
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
          <div>
            {(appointment?.status === 'UPCOMING' ||
              appointment?.status === 'IN_PROGRESS') && (
              <>
                <p className="text-text-muted text-sm mt-3.5 mb-1">
                  Quick links
                </p>
                <ChatButtons
                  appointment={appointment!}
                  refetch={refetch}
                  peerName={doctorPeerName}
                />
              </>
            )}
          </div>
          <DoctorRescheduleAppointment
            appointment={appointment!}
            doctor={doctor!}
            openModal={openRescheduleModal}
            setOpenModal={handleOpenRescheduleModal}
          />
          <CancelBookingModal
            openModal={openCancelBookingModal}
            setOpenModal={setOpenCancelBookingModal}
            isLoading={isPending}
            action={handleCancelAppointment}
          />
          <EndConsultationModal
            open={showEndModal}
            onClose={() => setShowEndModal(false)}
            onConfirm={() => {
              setShowEndModal(false);
              setShowNotesModal(true);
            }}
            appointmentId={id}
          />
          <StartConsultationModal
            open={showStartModal}
            onClose={() => setShowStartModal(false)}
            onConfirm={handleConfirmStartConsultation}
            isLoading={startingConsultation || isStartingConsultation}
          />
          <PostConsultationNotesModal
            open={showNotesModal}
            onClose={() => {
              setShowNotesModal(false);
              router.replace(`/dashboard/appointments/${id}`);
            }}
            onSubmit={handleSubmitNotes}
            isLoading={isSubmittingNotes}
          />
          {/* Video call opened from Start Consultation flow */}
          {active && roomName && token && uid && (
            <VideoCallModal open={active} onClose={() => clearCall()} />
          )}
        </div>
      )}
    </>
  );
};

export default DoctorAppointmentDetails;

const EditDetailsBtn = ({
  setOpenCancelBookingModal,
  setOpenRescheduleModal,
  appointment,
  onStartConsultation,
  isStartingConsultation,
}: {
  setOpenCancelBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRescheduleModal: React.Dispatch<React.SetStateAction<boolean>>;
  appointment: DoctorAppointment;
  onStartConsultation: () => void;
  isStartingConsultation: boolean;
}) => {
  return (
    <div className="flex items-center ml-auto gap-2">
      {appointment.status !== 'CANCELLED' && (
        <Button
          variant="outline"
          className="text-text-muted! hover:text-surface-card! py-2! px-4! text-sm"
          onClick={() => {
            setOpenCancelBookingModal(true);
          }}
        >
          Cancel booking
        </Button>
      )}
      <Button
        variant="primary"
        className="text-blue-11! bg-blue-3a! hover:bg-blue-2 py-2! px-4! text-sm"
        onClick={() => setOpenRescheduleModal(true)}
      >
        Reschedule
      </Button>
      <Button
        variant="primary"
        className="py-2! px-4! text-sm"
        onClick={onStartConsultation}
        loading={isStartingConsultation}
      >
        {isStartingConsultation ? 'Starting...' : 'Start Consultation'}
      </Button>
    </div>
  );
};

const ChatButtons = ({
  appointment,
  refetch,
  peerName,
}: {
  appointment: DoctorAppointment;
  refetch: () => Promise<any>;
  peerName: string;
}) => {
  const router = useRouter();
  const { active, roomName, token, uid, setCallDetails, clearCall } =
    useCallStore();

  const doctorToken = appointment.doctorToken;

  const handleJoinVideoCall = () => {
    if (roomName && token) {
      setCallDetails({
        roomName,
        token: token ?? doctorToken,
        uid: appointment.uid,
        callerName: peerName,
        role: 'DOCTOR',
        appointmentId: appointment.id,
      });
    } else {
      toaster.info('Start the consultation first to create a video room');
    }
  };

  return (
    <div className="flex items-center ml-auto gap-2">
      <Button
        variant="outline"
        className="min-w-38 text-sm text-text-alt! bg-gray-3a py-2! px-4! gap-2 border-none"
        onClick={() =>
          router.push(
            `/dashboard/messages?peerId=${appointment.clientId}&peerName=${encodeURIComponent(
              appointment.client?.firstName
                ? `${appointment.client.firstName} ${appointment.client.lastName}`
                : ''
            )}`
          )
        }
      >
        <ChatIconLocal />
        Chat
      </Button>
      <Button
        variant="outline"
        className="text-error! bg-error-3a py-2! px-4! gap-2 border-none"
        onClick={handleJoinVideoCall}
      >
        <SquarePlay size={16} />
        Join video call
      </Button>

      {active && roomName && token && uid && (
        <VideoCallModal open={active} onClose={clearCall} />
      )}
    </div>
  );
};
