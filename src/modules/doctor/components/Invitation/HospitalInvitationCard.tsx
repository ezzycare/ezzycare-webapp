import { useAcceptHospitalInvitationMutation } from '@/apiQuery/doctor/profile/acceptHospitalInvitation';
import type { HospitalInvitation } from '@/apiQuery/doctor/profile/types';
import { InvitationIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { useState } from 'react';
import DeclineAppointmentModal from '../Appointments/DeclineAppointmentModal';

interface HospitalInvitationCardProps {
  invitation: HospitalInvitation;
  onClose?: () => void;
}

const HospitalInvitationCard = ({
  invitation,
  onClose,
}: HospitalInvitationCardProps) => {
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const queryClient = useQueryClient();

  const [isDeclining, setIsDeclining] = useState(false);

  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptHospitalInvitationMutation();

  const invalidateInvitations = () => {
    queryClient.invalidateQueries({
      queryKey: ['doctor', 'hospital-invitations'],
    });
  };

  const handleAccept = () => {
    acceptInvitation(
      { id: String(invitation.id) },
      {
        onSuccess: () => {
          invalidateInvitations();
          toaster.success('Invitation accepted successfully');
          onClose?.();
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to accept invitation');
        },
      }
    );
  };

  const handleDecline = (reason: string) => {
    //
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

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center">
            <InvitationIconLocal />
          </div>

          <div className="flex flex-col">
            <h4 className="text-gray-12 font-semibold text-[15px] leading-5">
              Accept yor invitation!
            </h4>
            <p className="text-xs text-text-muted">
              You have been invited to join Emory specialist hospital as an in
              house Doctor
            </p>
          </div>
        </div>

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

export default HospitalInvitationCard;

export type { HospitalInvitationCardProps };
