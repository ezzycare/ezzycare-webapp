/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useCancelDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/cancelAppointment';
import { useGetDoctorAppointmentQuery } from '@/apiQuery/doctor/appointments/getAppointment';
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
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import dayjs from 'dayjs';
import { ArrowLeft, Briefcase, NotepadText, SquarePlay } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import DoctorRescheduleAppointment from './DoctorRescheduleAppointment';

const DoctorAppointmentDetails = () => {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [openRescheduleModal, setOpenRescheduleModal] = React.useState(false);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    React.useState(false);

  const { updateBooking } = useBookAppointmentStore();
  const { appointment: appointmentData, isFetching } =
    useGetDoctorAppointmentQuery({
      id,
    });

  const appointment = useMemo(() => {
    return appointmentData ? appointmentData : ({} as DoctorAppointment);
  }, [appointmentData]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: appointment?.userId,
    });

  const doctor = useMemo(() => {
    return doctorData ? doctorData : ({} as DoctorProfile);
  }, [doctorData]);

  const { hospital } = useGetSingleHospital({
    id: appointment?.hospitalId,
  });

  console.log({ hospital });

  const { mutate: cancelAppointment, isPending } =
    useCancelDoctorAppointmentMutation();

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
    cancelAppointment(
      {
        id: appointment.id!,
        reason,
      },
      {
        onSuccess: () => {
          toaster.success('Appointment cancelled successfully');
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
            {appointment.status === 'UPCOMING' && (
              <EditDetailsBtn
                appointment={appointment}
                setOpenCancelBookingModal={setOpenCancelBookingModal}
                setOpenRescheduleModal={setOpenRescheduleModal}
              />
            )}
            {appointment.status === 'PAID' && (
              <div className="flex items-center ml-auto gap-2">
                <Button
                  variant="outline"
                  className="min-w-38 text-sm text-blue-11! border-primary! py-2! px-4!"
                  onClick={() => {}}
                >
                  Decline
                </Button>
                <Button
                  variant="primary"
                  className="min-w-38 py-2! px-4! border-none"
                  onClick={() => {}}
                >
                  Accept
                </Button>
              </div>
            )}
            {appointment.status === 'COMPLETED' && (
              <Button
                variant="outline"
                className="min-w-38 text-sm text-text-alt! bg-gray-3a py-2! px-4! gap-2 border-none"
                onClick={() =>
                  router.push(
                    `/dashboard/messages?peerId=${appointment.clientId}`
                  )
                }
              >
                <ChatIconLocal />
                Follow-up
              </Button>
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
            <p className="text-text-muted text-sm mt-3.5 mb-1">Quick links</p>
            {appointment.status === 'UPCOMING' && (
              <ChatButtons appointment={appointment} />
            )}
          </div>
          <DoctorRescheduleAppointment
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
      )}
    </>
  );
};

export default DoctorAppointmentDetails;

const EditDetailsBtn = ({
  setOpenCancelBookingModal,
  setOpenRescheduleModal,
  appointment,
}: {
  setOpenCancelBookingModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenRescheduleModal: React.Dispatch<React.SetStateAction<boolean>>;
  appointment: DoctorAppointment;
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
        onClick={() => setOpenRescheduleModal(true)}
      >
        Start Consultation
      </Button>
    </div>
  );
};

const ChatButtons = ({ appointment }: { appointment: DoctorAppointment }) => {
  const router = useRouter();
  return (
    <div className="flex items-center ml-auto gap-2">
      <Button
        variant="outline"
        className="min-w-38 text-sm text-text-alt! bg-gray-3a py-2! px-4! gap-2 border-none"
        onClick={() =>
          router.push(`/dashboard/messages?peerId=${appointment.clientId}`)
        }
      >
        <ChatIconLocal />
        Chat
      </Button>
      <Button
        variant="outline"
        className="text-error! bg-error-3a py-2! px-4! gap-2 border-none"
        onClick={() =>
          router.push(
            `/dashboard/video-call?peerId=${appointment.clientId}&peerName=${encodeURIComponent(
              appointment.client?.firstName
                ? `${appointment.client.firstName} ${appointment.client.lastName}`
                : ''
            )}`
          )
        }
      >
        <SquarePlay size={16} />
        Join video call
      </Button>
    </div>
  );
};
