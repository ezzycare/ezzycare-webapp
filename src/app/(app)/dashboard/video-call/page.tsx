'use client';

import { getTwilioToken } from '@/apiQuery/communication/getToken';
import SpiralLoader from '@/components/Base/SpiralLoader';
import VideoCall from '@/modules/video';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const VideoCallPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const peerId = searchParams.get('peerId');
  const peerName = searchParams.get('peerName');
  const fallbackRoom = useRef(
    // eslint-disable-next-line react-hooks/purity
    `room_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const roomName =
    searchParams.get('room') || `video_${peerId ?? fallbackRoom.current}`;

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchToken = async () => {
      try {
        const res = await getTwilioToken({ roomName });
        if (!cancelled && res.data?.token) {
          setToken(res.data.token);
        } else if (!cancelled) {
          setError('Failed to obtain video token');
        }
      } catch {
        if (!cancelled) setError('Failed to connect to video service');
      }
    };

    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [roomName]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 p-4">
        <p className="text-sm text-text-muted">{error}</p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SpiralLoader />
      </div>
    );
  }

  return (
    <div>
      <VideoCall
        token={token}
        roomName={roomName}
        remoteName={peerName ?? undefined}
        onEndCall={() => router.back()}
      />
    </div>
  );
};

export default VideoCallPage;
