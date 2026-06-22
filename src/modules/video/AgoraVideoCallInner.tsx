// modules/video/agora.tsx
'use client';

import type { ICameraVideoTrack } from 'agora-rtc-react';
import AgoraRTC, {
  AgoraRTCProvider,
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from 'agora-rtc-react';
import { Mic, MicOff, SwitchCamera, Video, VideoOff, X } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

interface AgoraVideoCallProps {
  appId: string;
  channelName: string;
  token: string | null;
  uid?: number;
  remoteName?: string;
  onEndCall?: () => void;
  /** When true, fills its parent container. Otherwise renders a fixed phone-shaped card. */
  fullSize?: boolean;
}

function AgoraVideoCallInner({
  channelName,
  token,
  uid,
  appId,
  remoteName = '',
  onEndCall,
  fullSize = false,
}: AgoraVideoCallProps) {
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const facingRef = useRef<'user' | 'environment'>('user');

  const {
    isLoading: isJoining,
    isConnected,
    error: joinError,
  } = useJoin({ appid: appId, channel: channelName, token, uid }, true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack, isLoading: cameraLoading } =
    useLocalCameraTrack(cameraOn);

  usePublish([localMicrophoneTrack, localCameraTrack], isConnected);

  const remoteUsers = useRemoteUsers();
  const hasRemoteUsers = remoteUsers.length > 0;

  const handleEndCall = useCallback(() => {
    onEndCall?.();
  }, [onEndCall]);

  const handleFlipCamera = useCallback(() => {
    const track = localCameraTrack as ICameraVideoTrack | null;
    if (!track) return;
    const next = facingRef.current === 'user' ? 'environment' : 'user';
    facingRef.current = next;
    track.setDevice({ facingMode: next }).catch(() => {});
  }, [localCameraTrack]);

  const error = joinError
    ? joinError.message || 'Failed to join channel'
    : null;

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-12 shadow-xl',
        fullSize
          ? 'w-full h-full md:rounded-3xl'
          : 'w-full max-w-[280px] aspect-[9/19] rounded-3xl mx-auto'
      )}
    >
      {/* Error state */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 p-6 text-center bg-gray-12">
          <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
            <X className="w-7 h-7 text-error" />
          </div>
          <p className="text-sm text-text-muted leading-relaxed">{error}</p>
          <button
            onClick={handleEndCall}
            className="px-4 py-2 rounded-lg bg-primary text-foreground text-sm hover:opacity-90 transition-opacity"
          >
            Go back
          </button>
        </div>
      )}

      {/* Connecting state */}
      {!error && isJoining && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-foreground">
          <div className="w-16 h-16 rounded-full bg-surface-card/20 flex items-center justify-center">
            <VideoOff className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium">Connecting…</p>
        </div>
      )}

      {/* Remote users */}
      {!error && !isJoining && hasRemoteUsers && (
        <div className="absolute inset-0">
          {remoteUsers.map((user) => (
            <RemoteUser
              key={user.uid}
              user={user}
              playVideo
              playAudio
              videoPlayerConfig={{ mirror: false, fit: 'cover' }}
              className="absolute inset-0 w-full! h-full!"
            />
          ))}
        </div>
      )}

      {/* Waiting for remote */}
      {!error && !isJoining && !hasRemoteUsers && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground">
          <div className="w-16 h-16 rounded-full bg-surface-card/20 flex items-center justify-center">
            <VideoOff className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium">
            Waiting for {remoteName || 'others'}…
          </p>
        </div>
      )}

      {/* Camera-off overlay (over remote video if any) */}
      {!error && !isJoining && !cameraOn && (
        <div className="absolute inset-0 z-10 bg-gray-12/85 flex flex-col items-center justify-center gap-3 text-foreground">
          <div className="w-20 h-20 rounded-full bg-gray-11/40 flex items-center justify-center">
            <VideoOff className="w-8 h-8" />
          </div>
          <p className="text-sm font-medium">Camera off</p>
        </div>
      )}

      {/* Local self-view (picture-in-picture) */}
      {!error && !isJoining && cameraOn && !cameraLoading && (
        <div className="absolute top-4 right-4 w-20 h-28 rounded-xl overflow-hidden border-2 border-surface-card/30 shadow-lg z-20">
          <LocalUser
            audioTrack={localMicrophoneTrack}
            videoTrack={localCameraTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            playVideo
            playAudio={false}
            className="w-full! h-full!"
          />
        </div>
      )}

      {/* Controls */}
      {!error && !isJoining && (
        <div className="absolute bottom-6 left-0 right-0 z-30 flex items-center justify-center gap-2.5">
          <ControlButton
            label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
            onClick={() => setCameraOn((v) => !v)}
            variant="dark"
          >
            {cameraOn ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </ControlButton>

          <ControlButton
            label={micOn ? 'Mute microphone' : 'Unmute microphone'}
            onClick={() => setMicOn((v) => !v)}
            variant="light"
          >
            {micOn ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </ControlButton>

          <ControlButton
            label="Flip camera"
            onClick={handleFlipCamera}
            variant="light"
          >
            <SwitchCamera className="w-4 h-4" />
          </ControlButton>

          <ControlButton
            label="End call"
            onClick={handleEndCall}
            variant="danger"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </ControlButton>
        </div>
      )}
    </div>
  );
}

export default function AgoraVideoCall(props: AgoraVideoCallProps) {
  // Create a single client per mount. Memo keeps it stable across re-renders.
  const client = useMemo(
    () => AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' }),
    []
  );

  return (
    <AgoraRTCProvider client={client}>
      <AgoraVideoCallInner {...props} />
    </AgoraRTCProvider>
  );
}

interface ControlButtonProps {
  label: string;
  onClick?: () => void;
  variant: 'dark' | 'light' | 'danger';
  children: React.ReactNode;
}

function ControlButton({
  label,
  onClick,
  variant,
  children,
}: ControlButtonProps) {
  const styles = {
    dark: 'bg-blue-12 text-foreground hover:bg-blue-11',
    light: 'bg-surface-card text-gray-12 hover:bg-gray-2',
    danger: 'bg-error text-foreground hover:opacity-90',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'w-9 h-9 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-colors',
        styles[variant]
      )}
    >
      {children}
    </button>
  );
}
