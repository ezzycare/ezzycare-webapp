import { useAcceptDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/acceptAppointment';
import { useDeclineDoctorAppointmentMutation } from '@/apiQuery/doctor/appointments/declineAppointment';
import { DoctorAppointment } from '@/apiQuery/doctor/appointments/types';
import { toaster } from '@/lib/toaster';
import { getInitials } from '@/utils/helper';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Calendar, Clock, X } from 'lucide-react';
import { useState } from 'react';
import DeclineAppointmentModal from './DeclineAppointmentModal';

interface AppointmentRequestCardProps {
  appointment: DoctorAppointment;
  onClose?: () => void;
}

const AppointmentRequestCard = ({
  appointment,
  onClose,
}: AppointmentRequestCardProps) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const queryClient = useQueryClient();

  const displayInitials = appointment?.client
    ? getInitials(
        `${appointment.client.firstName} ${appointment.client.lastName}`
      )
    : '';

  const { mutate: acceptAppointment, isPending: isAccepting } =
    useAcceptDoctorAppointmentMutation();
  const { mutate: declineAppointment, isPending: isDeclining } =
    useDeclineDoctorAppointmentMutation();

  const invalidateAppointments = () => {
    queryClient.invalidateQueries({ queryKey: ['doctor', 'appointments'] });
  };

  const handleAccept = () => {
    acceptAppointment(
      { id: String(appointment.id) },
      {
        onSuccess: () => {
          invalidateAppointments();
          toaster.success('Appointment accepted successfully');
          onClose?.();
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to accept appointment');
        },
      }
    );
  };

  const handleDecline = (reason: string) => {
    declineAppointment(
      { id: appointment.id, reason },
      {
        onSuccess: () => {
          invalidateAppointments();
          setShowDeclineModal(false);
          toaster.success('Appointment declined');
          onClose?.();
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to decline appointment');
        },
      }
    );
  };

  return (
    <>
      <div className="relative w-full max-w-137.5 bg-surface-card rounded-2xl p-4 px-6 shadow-sm border border-gray-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-10 hover:text-gray-12 transition-colors"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>

        {/* Left Side: Avatar and Info */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-lg bg-blue-7 flex items-center justify-center text-white font-semibold text-lg">
            {displayInitials}
          </div>

          {/* Text Info */}
          <div className="flex flex-col">
            <h4 className="text-gray-12 font-semibold text-[15px] leading-5">
              {appointment.client.firstName} {appointment.client.lastName}
            </h4>
            <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-11">
              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-10" />
                <span>
                  {dayjs(appointment.appointmentDate).format('MMM DD, YYYY')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-10" />
                <span>{appointment.appointmentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Buttons */}
        <div className="flex items-center gap-1 sm:gap-2.5 mr-2">
          <button
            onClick={() => setShowDeclineModal(true)}
            disabled={isDeclining || isAccepting}
            className="px-4 py-1.5 border border-gray-4 rounded-lg text-gray-11 bg-surface-card hover:bg-gray-2 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={isAccepting || isDeclining}
            className="px-5 py-1.5 bg-blue-11 text-white rounded-lg hover:bg-blue-12 disabled:opacity-50 transition-colors text-sm font-medium"
          >
            {isAccepting ? 'Accepting...' : 'Accept'}
          </button>
        </div>
      </div>

      <DeclineAppointmentModal
        open={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        isLoading={isDeclining}
        onSubmit={handleDecline}
      />
    </>
  );
};

export default AppointmentRequestCard;

export type { AppointmentRequestCardProps };
