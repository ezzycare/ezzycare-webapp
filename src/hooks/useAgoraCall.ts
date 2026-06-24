/* eslint-disable @typescript-eslint/no-explicit-any */
import { agoraClient } from '@/lib/agoraClient';
import AgoraRTC, {
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { useCallback, useEffect, useRef, useState } from 'react';

type CallQuality = 'good' | 'fair' | 'poor';

export const useAgoraCall = (appId: string) => {
  const [isJoined, setIsJoined] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [callQuality, setCallQuality] = useState<CallQuality>('good');
  const [error, setError] = useState<string | null>(null);

  // Tracks exposed to React
  const [localCameraTrack, setLocalCameraTrack] =
    useState<ICameraVideoTrack | null>(null);

  const [localMicrophoneTrack, setLocalMicrophoneTrack] =
    useState<IMicrophoneAudioTrack | null>(null);

  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<IRemoteVideoTrack | null>(null);

  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<IRemoteAudioTrack | null>(null);

  const [remoteUser, setRemoteUser] = useState<any>(null);

  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);

  // Internal refs for imperative actions
  const localAudioRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoRef = useRef<ICameraVideoTrack | null>(null);

  const cleanupTracks = useCallback(() => {
    localAudioRef.current?.stop();
    localAudioRef.current?.close();

    localVideoRef.current?.stop();
    localVideoRef.current?.close();

    localAudioRef.current = null;
    localVideoRef.current = null;

    setLocalMicrophoneTrack(null);
    setLocalCameraTrack(null);

    setRemoteAudioTrack(null);
    setRemoteVideoTrack(null);
    setRemoteUser(null);
  }, []);

  // Call timer
  useEffect(() => {
    if (!isJoined) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isJoined]);

  // Agora events
  useEffect(() => {
    const handleConnectionStateChange = (curState: string) => {
      setConnectionState(curState);
      setIsReconnecting(curState === 'RECONNECTING');
    };

    const handleUserPublished = async (
      user: any,
      mediaType: 'audio' | 'video'
    ) => {
      try {
        await agoraClient.subscribe(user, mediaType);

        setRemoteUser(user);

        if (mediaType === 'video' && user.videoTrack) {
          setRemoteVideoTrack(user.videoTrack);
        }

        if (mediaType === 'audio' && user.audioTrack) {
          setRemoteAudioTrack(user.audioTrack);

          // Auto-play remote audio
          user.audioTrack.play();
        }
      } catch (err) {
        console.error('Subscribe error:', err);
      }
    };

    const handleUserUnpublished = (user: any, mediaType: 'audio' | 'video') => {
      if (mediaType === 'video') {
        setRemoteVideoTrack(null);
      }

      if (mediaType === 'audio') {
        setRemoteAudioTrack(null);
      }

      if (!user.hasAudio && !user.hasVideo) {
        setRemoteUser(null);
      }
    };

    const handleUserLeft = (_user: any) => {
      setRemoteUser(null);
      setRemoteVideoTrack(null);
      setRemoteAudioTrack(null);
    };

    const handleNetworkQuality = (stats: any) => {
      const quality = Math.max(
        stats.uplinkNetworkQuality ?? 1,
        stats.downlinkNetworkQuality ?? 1
      );

      if (quality <= 2) {
        setCallQuality('good');
      } else if (quality <= 4) {
        setCallQuality('fair');
      } else {
        setCallQuality('poor');
      }
    };

    agoraClient.on('connection-state-change', handleConnectionStateChange);

    agoraClient.on('user-published', handleUserPublished);

    agoraClient.on('user-unpublished', handleUserUnpublished);

    agoraClient.on('user-left', handleUserLeft);

    agoraClient.on('network-quality', handleNetworkQuality);

    return () => {
      agoraClient.off('connection-state-change', handleConnectionStateChange);

      agoraClient.off('user-published', handleUserPublished);

      agoraClient.off('user-unpublished', handleUserUnpublished);

      agoraClient.off('user-left', handleUserLeft);

      agoraClient.off('network-quality', handleNetworkQuality);
    };
  }, []);

  const join = useCallback(
    async (channel: string, token: string | null, uid: UID) => {
      try {
        setError(null);

        await agoraClient.join(appId, channel, token, uid);

        const [audioTrack, videoTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        localAudioRef.current = audioTrack;
        localVideoRef.current = videoTrack;

        setLocalMicrophoneTrack(audioTrack);
        setLocalCameraTrack(videoTrack);

        await agoraClient.publish([audioTrack, videoTrack]);

        setIsJoined(true);
      } catch (err: any) {
        // OPERATION_ABORTED is expected when React Strict Mode remounts
        // or a previous join is cancelled — ignore it silently
        if (
          err?.code === 'OPERATION_ABORTED' ||
          err?.message?.includes?.('cancel token canceled')
        ) {
          return;
        }

        console.error(err);

        setError(err?.message ?? 'Failed to join call');

        cleanupTracks();

        try {
          await agoraClient.leave();
        } catch {}

        setIsJoined(false);
      }
    },
    [appId, cleanupTracks]
  );

  const leave = useCallback(async () => {
    try {
      cleanupTracks();

      await agoraClient.leave();
    } catch (err) {
      console.error(err);
    } finally {
      setIsJoined(false);
      setCallDuration(0);
      setConnectionState('DISCONNECTED');
      setIsReconnecting(false);
    }
  }, [cleanupTracks]);

  const toggleMic = useCallback(async () => {
    const track = localAudioRef.current;

    if (!track) return;

    const nextState = !track.enabled;
    await track.setEnabled(nextState);
    setIsMicEnabled(nextState);
  }, []);

  const toggleCamera = useCallback(async () => {
    const track = localVideoRef.current;

    if (!track) return;

    const nextState = !track.enabled;
    await track.setEnabled(nextState);
    setIsCameraEnabled(nextState);
  }, []);

  const cameraFacingRef = useRef<'user' | 'environment'>('user');

  const switchCamera = useCallback(async () => {
    const track = localVideoRef.current;

    if (!track) return;

    const nextFacing =
      cameraFacingRef.current === 'user' ? 'environment' : 'user';
    cameraFacingRef.current = nextFacing;

    try {
      await track.setDevice({ facingMode: nextFacing });
    } catch (err) {
      console.warn('Camera switch failed:', err);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupTracks();
    };
  }, [cleanupTracks]);

  return {
    isJoined,

    localCameraTrack,
    localMicrophoneTrack,

    remoteUser,
    remoteVideoTrack,
    remoteAudioTrack,

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
    callQuality,
    error,
  };
};
