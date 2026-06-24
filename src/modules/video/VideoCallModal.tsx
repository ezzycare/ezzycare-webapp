'use client';

import Modal from '@/components/Ui/Modal';
import { useAgoraCall } from '@/hooks/useAgoraCall';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { cn } from '@/lib/utils';
import { EndConsultationModal } from '@/modules/doctor/components/Appointments/EndConsultationModal';
import { useCallStore } from '@/stores/callStore';
import { Cross2Icon } from '@radix-ui/react-icons';
import {
  MessageSquare,
  Mic,
  MicOff,
  SwitchCamera,
  Video,
  VideoOff,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;

interface ControlButtonProps {
  onClick: () => void;
  active?: boolean;
  variant?: 'default' | 'danger';
  children: React.ReactNode;
  label: string;
}

const ControlButton = ({
  onClick,
  active = true,
  variant = 'default',
  children,
  label,
}: ControlButtonProps) => {
  const variantClasses =
    variant === 'danger'
      ? 'bg-red-500 text-white hover:bg-red-600 w-12 h-12'
      : active
        ? 'bg-gray-11/90 text-white hover:bg-gray-11 w-11 h-11'
        : 'bg-red-500 text-white hover:bg-red-600 w-11 h-11';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'rounded-full flex items-center justify-center cursor-pointer',
        'transition-all duration-200 active:scale-90 shadow-lg',
        variantClasses
      )}
    >
      {children}
    </button>
  );
};

interface ControlButtonsProps {
  isCameraEnabled: boolean;
  isMicEnabled: boolean;
  toggleCamera: () => void;
  toggleMic: () => void;
  switchCamera: () => void;
  endCall: () => void;
  onChat: () => void;
}

function ControlButtons({
  isCameraEnabled,
  isMicEnabled,
  toggleCamera,
  toggleMic,
  switchCamera,
  endCall,
  onChat,
}: ControlButtonsProps) {
  return (
    <>
      <ControlButton
        onClick={toggleCamera}
        active={isCameraEnabled}
        label={isCameraEnabled ? 'Turn off camera' : 'Turn on camera'}
      >
        {isCameraEnabled ? (
          <Video className="w-4 h-4" />
        ) : (
          <VideoOff className="w-4 h-4" />
        )}
      </ControlButton>

      <ControlButton
        onClick={toggleMic}
        active={isMicEnabled}
        label={isMicEnabled ? 'Mute microphone' : 'Unmute microphone'}
      >
        {isMicEnabled ? (
          <Mic className="w-4 h-4" />
        ) : (
          <MicOff className="w-4 h-4" />
        )}
      </ControlButton>

      <ControlButton onClick={switchCamera} label="Switch camera">
        <SwitchCamera className="w-4 h-4" />
      </ControlButton>

      <ControlButton onClick={onChat} label="Open chat">
        <MessageSquare className="w-4 h-4" />
      </ControlButton>

      <ControlButton onClick={endCall} variant="danger" label="End call">
        <Cross2Icon className="w-5 h-5" />
      </ControlButton>
    </>
  );
}

export default function VideoCallModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { roomName, token, uid, role, callerName, clearCall } = useCallStore();

  const {
    isJoined,
    localCameraTrack,
    remoteVideoTrack,
    join,
    leave,
    toggleMic,
    toggleCamera,
    switchCamera,
    isMicEnabled,
    isCameraEnabled,
    callDuration,
    connectionState,
    isReconnecting,
  } = useAgoraCall(AGORA_APP_ID);

  const localRef = useRef<HTMLDivElement>(null);
  const remoteRef = useRef<HTMLDivElement>(null);
  const hasJoinedRef = useRef(false);

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const { accountType } = useGetAccountType();
  const isDoctor = accountType === 'DOCTOR';

  useEffect(() => {
    if (!open || !roomName || !token || !uid || hasJoinedRef.current) return;
    hasJoinedRef.current = true;
    join(roomName, token, uid);
  }, [open, roomName, token, uid, join]);

  useEffect(() => {
    if (!open && hasJoinedRef.current) {
      leave();
      clearCall();
      hasJoinedRef.current = false;
    }
  }, [open, leave, clearCall]);

  useEffect(() => {
    if (!localCameraTrack || !localRef.current) return;
    localCameraTrack.play(localRef.current);
    return () => {
      localCameraTrack.stop();
    };
  }, [localCameraTrack]);

  useEffect(() => {
    if (!remoteVideoTrack || !remoteRef.current) return;
    remoteVideoTrack.play(remoteRef.current);
    return () => {
      remoteVideoTrack.stop();
    };
  }, [remoteVideoTrack]);

  const endCall = async () => {
    await leave();
    clearCall();
    hasJoinedRef.current = false;
    setShowEndConfirm(false);
    onClose();
  };

  const handleEndCallClick = () => {
    if (isDoctor) {
      setShowEndConfirm(true);
    } else {
      endCall();
    }
  };

  const hours = Math.floor(callDuration / 3600);
  const minutes = Math.floor((callDuration % 3600) / 60);
  const seconds = callDuration % 60;
  const timeDisplay =
    hours > 0
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const controlProps: ControlButtonsProps = {
    isCameraEnabled,
    isMicEnabled,
    toggleCamera,
    toggleMic,
    switchCamera,
    endCall: handleEndCallClick,
    onChat: () => {
      // TODO: wire up in-call chat
    },
  };

  return (
    <Modal
      open={open}
      onClose={endCall}
      size="full"
      containerClassName="!p-0 backdrop-blur-md bg-black/40"
      showCloseButton={false}
      className="bg-transparent! shadow-none border-none p-0! rounded-none! sm:rounded-2xl! max-w-none! sm:max-w-300!"
      persistent
    >
      {/* Root: mobile = fullscreen flex, desktop = centered card with margin */}
      <div className="relative w-full h-dvh sm:h-auto sm:py-6 flex flex-col items-center justify-center">
        {/* CALL CARD */}
        <div
          className={cn(
            'relative w-full bg-gray-12 overflow-hidden shadow-2xl',
            // Mobile: full viewport
            'h-dvh',
            // Desktop: contained 16:9 card with rounded corners
            'sm:h-auto sm:aspect-video sm:rounded-2xl'
          )}
        >
          {/* REMOTE VIDEO (background layer) */}
          <div ref={remoteRef} className="absolute inset-0" />

          {/* Remote name label — bottom-left; lifted on mobile so controls don't cover it */}
          <div
            className="absolute left-3 z-20
              bg-gray-12/60 backdrop-blur-sm
              text-white text-xs font-medium
              px-3 py-1.5 rounded-lg
              bottom-24 sm:bottom-3"
          >
            {callerName ?? 'Dr. Micheal Stephanie'}
          </div>

          {/* Status / timer — top-right, safe-area aware on mobile */}
          <div
            className="absolute right-3 z-20 flex items-center gap-2"
            style={{ top: 'max(env(safe-area-inset-top) + 12px, 12px)' }}
          >
            {connectionState !== 'CONNECTED' && (
              <span
                className={cn(
                  'text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm',
                  isReconnecting ? 'bg-warning-8a text-white' : 'bg-gray-12/60'
                )}
              >
                {isReconnecting ? 'Reconnecting…' : connectionState}
              </span>
            )}
            {isJoined && (
              <span className="text-white text-xs bg-gray-12/60 backdrop-blur-sm px-2 py-1 rounded-full tabular-nums">
                {timeDisplay}
              </span>
            )}
          </div>

          {/* LOCAL VIDEO (PiP) — bottom-right; lifted on mobile to clear controls */}
          <div className="absolute right-3 z-20 bottom-24 sm:bottom-3">
            <div
              ref={localRef}
              className={cn(
                'relative overflow-hidden rounded-xl bg-gray-12',
                'w-24 h-32 sm:w-36 sm:h-44',
                'border border-white/20 shadow-xl'
              )}
            />
            <span
              className="absolute bottom-2 left-2 z-30
                text-white text-[10px] font-medium
                bg-gray-12/60 backdrop-blur-sm
                px-2 py-0.5 rounded"
            >
              You
            </span>
          </div>

          {/* MOBILE CONTROLS — overlaid on the card, inside safe-area */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 z-30',
              'flex items-center justify-center gap-3',
              'px-4 pt-3',
              'pb-[max(env(safe-area-inset-bottom)+16px,16px)]',
              // Desktop hides; controls render below the card instead
              'sm:hidden'
            )}
          >
            <ControlButtons {...controlProps} />
          </div>
        </div>

        {/* DESKTOP CONTROLS — outside the card, below it */}
        <div className="hidden sm:flex items-center justify-center gap-4 mt-5">
          <ControlButtons {...controlProps} />
        </div>
      </div>

      <EndConsultationModal
        open={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        onConfirm={endCall}
      />
    </Modal>
  );
}
