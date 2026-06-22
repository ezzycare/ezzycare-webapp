/* eslint-disable react-hooks/set-state-in-effect */
// components/video/VideoCallOverlay.tsx
'use client';

import { getAgoraToken } from '@/apiQuery/communication/getAgoraToken';
import SpiralLoader from '@/components/Base/SpiralLoader';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { cn } from '@/lib/utils';
import { EndConsultationModal } from '@/modules/doctor/components/Appointments/EndConsultationModal';
import AgoraVideoCall from '@/modules/video/AgoraVideoCallInner';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

function generateAgoraUid(): number {
  return Math.floor(Math.random() * 1_000_000) + 1;
}

interface VideoCallOverlayProps {
  open: boolean;
  onClose: () => void;
  channelName: string | null;
  peerName?: string;
  uid?: number;
  appointmentId?: string;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

export default function VideoCallOverlay({
  open,
  onClose,
  channelName,
  peerName,
  uid: propUid,
  appointmentId,
}: VideoCallOverlayProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { accountType } = useGetAccountType();
  const isDoctor = accountType === 'DOCTOR';
  const agoraUid = useMemo(() => propUid ?? generateAgoraUid(), [propUid]);

  const [appId, setAppId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [resolvedChannel, setResolvedChannel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEndModal, setShowEndModal] = useState(false);

  const handleConfirmEnd = useCallback(() => {
    setShowEndModal(false);
    onClose();
    if (appointmentId) {
      router.replace(`/dashboard/appointments/${appointmentId}?notes=1`);
    }
  }, [onClose, appointmentId, router]);

  const handleClose = useCallback(() => {
    if (isDoctor) {
      setShowEndModal(true);
    } else {
      onClose();
    }
  }, [isDoctor, onClose]);

  // Reset state when overlay closes so a fresh fetch happens on reopen
  useEffect(() => {
    if (!open) {
      setAppId(null);
      setToken(null);
      setResolvedChannel(null);
      setError(null);
    }
  }, [open]);

  // Fetch token when overlay opens
  useEffect(() => {
    if (!open || !channelName) return;

    let cancelled = false;
    setError(null);

    (async () => {
      try {
        const res = await getAgoraToken({
          channelName,
          uid: agoraUid,
        });
        if (cancelled) return;
        if (res.data?.token && res.data?.appId) {
          setToken(res.data.token);
          setAppId(res.data.appId);
          setResolvedChannel(res.data.channelName || channelName);
        } else {
          setError('Failed to obtain video token');
        }
      } catch {
        if (!cancelled) setError('Failed to connect to video service');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, channelName, agoraUid]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, handleClose]);

  if (!open) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Video call"
        className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-12/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isMobile) {
            handleClose();
          }
        }}
      >
        {/* Desktop close button — visible outside the call card */}
        {!isMobile && (
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close video call"
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-card/10 hover:bg-surface-card/20 text-foreground flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Container: mobile = phone card, desktop = larger frame */}
        <div
          className={cn(
            'relative',
            isMobile
              ? 'w-full h-[100dvh]'
              : 'w-full max-w-[420px] aspect-[9/16] max-h-[90vh]'
          )}
        >
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-gray-12 rounded-3xl">
              <p className="text-sm text-text-muted leading-relaxed">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-primary text-foreground text-sm hover:opacity-90 transition-opacity"
              >
                Go back
              </button>
            </div>
          ) : !appId || !token || !resolvedChannel ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-12 rounded-3xl">
              <SpiralLoader />
            </div>
          ) : (
            <AgoraVideoCall
              appId={appId}
              channelName={resolvedChannel}
              token={token}
              uid={agoraUid}
              remoteName={peerName}
              onEndCall={handleClose}
              fullSize
            />
          )}
        </div>
      </div>
      <EndConsultationModal
        open={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleConfirmEnd}
      />
    </>,
    document.body
  );
}
