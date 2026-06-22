'use client';

import { getAgoraToken } from '@/apiQuery/communication/getAgoraToken';
import SpiralLoader from '@/components/Base/SpiralLoader';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { EndConsultationModal } from '@/modules/doctor/components/Appointments/EndConsultationModal';
import AgoraVideoCall from '@/modules/video/agora';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

function generateAgoraUid(): number {
  return Math.floor(Math.random() * 1_000_000) + 1;
}

const VideoCallPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const peerName = searchParams.get('peerName');
  const roomParam = searchParams.get('room');
  const uidParam = searchParams.get('uid');

  const { accountType } = useGetAccountType();
  const isDoctor = accountType === 'DOCTOR';

  const agoraUid = useMemo(
    () => (uidParam ? Number(uidParam) : generateAgoraUid()),
    [uidParam]
  );

  const [appId, setAppId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const handleEndCall = useCallback(() => {
    if (isDoctor) {
      setShowEndModal(true);
    } else {
      router.back();
    }
  }, [isDoctor, router]);

  const handleConfirmEnd = useCallback(() => {
    setShowEndModal(false);
    router.replace(
      `/dashboard/appointments/${searchParams.get('appointmentId')}?notes=1`
    );
  }, [router, searchParams]);

  useEffect(() => {
    let cancelled = false;

    const channel = roomParam;

    if (!channel) {
      return;
    }

    const fetchToken = async () => {
      try {
        const res = await getAgoraToken({
          channelName: channel,
          uid: agoraUid,
        });
        if (!cancelled && res.data?.token && res.data?.appId) {
          setToken(res.data.token);
          setAppId(res.data.appId);
          setChannelName(res.data.channelName || channel);
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
  }, [roomParam, agoraUid]);

  if (!roomParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4 p-4">
        <p className="text-sm text-text-muted">
          Missing video room information. Please go back and try again.
        </p>
        <button
          onClick={() => router.back()}
          className="text-sm text-primary hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

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

  if (!appId || !token || !channelName) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <SpiralLoader />
      </div>
    );
  }

  return (
    <>
      <AgoraVideoCall
        appId={appId}
        channelName={channelName}
        token={token}
        uid={agoraUid}
        remoteName={peerName ?? undefined}
        onEndCall={handleEndCall}
      />
      <EndConsultationModal
        open={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleConfirmEnd}
      />
    </>
  );
};

export default VideoCallPage;
