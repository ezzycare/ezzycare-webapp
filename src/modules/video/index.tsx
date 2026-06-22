'use client';

import { Mic, MicOff, SwitchCamera, Video, VideoOff, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  RemoteParticipant,
  RemoteTrack,
  RemoteVideoTrack,
  Room,
} from 'twilio-video';
import { connect, createLocalVideoTrack } from 'twilio-video';

interface VideoCallProps {
  token: string;
  roomName: string;
  remoteName?: string;
  onEndCall?: () => void;
}

export default function VideoCall({
  token,
  roomName,
  remoteName = '',
  onEndCall,
}: VideoCallProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoFacing, setVideoFacing] = useState<'user' | 'environment'>(
    'user'
  );
  const videoFacingRef = useRef(videoFacing);

  useEffect(() => {
    videoFacingRef.current = videoFacing;
  }, [videoFacing]);

  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const roomRef = useRef<Room | null>(null);

  const cleanup = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.localParticipant.tracks.forEach((pub) => {
        if (pub.track && pub.track.kind !== 'data' && 'stop' in pub.track) {
          (pub.track as { stop: () => void }).stop();
          pub.unpublish();
        }
      });
      roomRef.current.disconnect();
    }
    roomRef.current = null;
    setRoom(null);
    setConnected(false);
  }, []);

  useEffect(() => {
    if (!token || !roomName) return;

    let cancelled = false;

    const init = async () => {
      try {
        setError(null);
        const r = await connect(token, {
          name: roomName,
          audio: true,
          video: { facingMode: videoFacingRef.current },
        });

        if (cancelled) {
          r.disconnect();
          return;
        }

        roomRef.current = r;
        setRoom(r);
        setConnected(true);

        const localPub = Array.from(r.localParticipant.videoTracks.values())[0];

        if (localPub?.track && localVideoRef.current) {
          localPub.track.attach(localVideoRef.current);
        }

        const handleRemoteTrack = (track: RemoteTrack) => {
          if (track.kind === 'video' && remoteVideoRef.current) {
            (track as RemoteVideoTrack).attach(remoteVideoRef.current);
          }
        };

        r.participants.forEach((participant) => {
          participant.tracks.forEach((pub) => {
            if (pub.track && pub.isSubscribed) {
              handleRemoteTrack(pub.track);
            }
          });
          participant.on('trackSubscribed', handleRemoteTrack);
        });

        r.on('participantConnected', (participant: RemoteParticipant) => {
          participant.tracks.forEach((pub) => {
            if (pub.track && pub.isSubscribed) {
              handleRemoteTrack(pub.track);
            }
          });
          participant.on('trackSubscribed', handleRemoteTrack);
        });
      } catch (err: unknown) {
        if (cancelled) return;

        const message =
          err instanceof Error ? err.message : 'Failed to connect';

        if (
          message.includes('NotAllowedError') ||
          message.includes('Permission denied') ||
          message.includes('PermissionDeniedError')
        ) {
          setError(
            'Camera or microphone permission was denied. Please allow access in your browser settings and try again.'
          );
        } else if (
          message.includes('NotFoundError') ||
          message.includes('DevicesNotFoundError')
        ) {
          setError(
            'No camera or microphone found. Please connect a device and try again.'
          );
        } else if (
          message.includes('NotReadableError') ||
          message.includes('TrackStartError')
        ) {
          setError(
            'Your camera or microphone is in use by another application. Please close other apps and try again.'
          );
        } else if (
          message.includes('530') ||
          message.includes('Signaling') ||
          message.includes('connection')
        ) {
          setError('Unable to reach the video service. Please try again.');
        } else {
          setError(message || 'Failed to connect to video call');
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      if (roomRef.current) {
        roomRef.current.localParticipant.tracks.forEach((pub) => {
          if (pub.track && pub.track.kind !== 'data' && 'stop' in pub.track) {
            (pub.track as { stop: () => void }).stop();
            pub.unpublish();
          }
        });
        roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [token, roomName, cleanup]);

  const toggleMic = () => {
    if (!room) return;
    const enabled = !micOn;
    room.localParticipant.audioTracks.forEach((pub) => {
      if (pub.track) {
        pub.track.enable(enabled);
      }
    });
    setMicOn(enabled);
  };

  const toggleCamera = () => {
    if (!room) return;
    const enabled = !videoOn;
    room.localParticipant.videoTracks.forEach((pub) => {
      if (pub.track) {
        pub.track.enable(enabled);
      }
    });
    setVideoOn(enabled);
  };

  const flipCamera = async () => {
    if (!room) return;

    const newFacing = videoFacing === 'user' ? 'environment' : 'user';
    setVideoFacing(newFacing);

    const currentPub = Array.from(
      room.localParticipant.videoTracks.values()
    )[0];

    const newTrack = await createLocalVideoTrack({
      facingMode: newFacing,
    });

    if (currentPub) {
      room.localParticipant.unpublishTrack(currentPub.track);
      if ('stop' in currentPub.track) {
        currentPub.track.stop();
      }
    }

    await room.localParticipant.publishTrack(newTrack);

    if (localVideoRef.current) {
      newTrack.attach(localVideoRef.current);
    }
  };

  const handleEndCall = () => {
    cleanup();
    onEndCall?.();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-3xl overflow-hidden bg-gray-12 shadow-xl">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
              <X className="w-7 h-7 text-error" />
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{error}</p>
            <button
              onClick={handleEndCall}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity"
            >
              Go back
            </button>
          </div>
        ) : connected ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            aria-label={`Live video from ${remoteName}`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-foreground">
            <div className="w-16 h-16 rounded-full bg-surface-card/20 flex items-center justify-center">
              <VideoOff className="w-7 h-7" />
            </div>
            <p className="text-sm font-medium">Connecting...</p>
          </div>
        )}

        {!error && connected && !videoOn && (
          <div className="absolute inset-0 bg-gray-12/85 flex flex-col items-center justify-center gap-3 text-foreground">
            <div className="w-20 h-20 rounded-full bg-gray-11/40 flex items-center justify-center">
              <VideoOff className="w-8 h-8" />
            </div>
            <p className="text-sm font-medium">Camera off</p>
          </div>
        )}

        {!error && connected && videoOn && (
          <div className="absolute top-4 right-4 w-20 h-28 rounded-xl overflow-hidden border-2 border-white/30 shadow-lg z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {!error && (
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-2.5">
            <ControlButton
              label={videoOn ? 'Turn off camera' : 'Turn on camera'}
              onClick={toggleCamera}
              variant="dark"
            >
              {videoOn ? (
                <Video className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
            </ControlButton>

            <ControlButton
              label={micOn ? 'Mute microphone' : 'Unmute microphone'}
              onClick={toggleMic}
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
              onClick={flipCamera}
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
    </div>
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
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
