'use client';

import { cn } from '@/lib/utils';
import { useCallStore } from '@/stores/callStore';
import { Phone, PhoneOff } from 'lucide-react';

export default function IncomingCallUI({
  accepted,
  setAccepted,
}: {
  accepted: boolean;
  setAccepted: (accepted: boolean) => void;
}) {
  const { active, role, callerName, clearCall } = useCallStore();

  if (!active || accepted) return null;

  const handleAccept = () => {
    setAccepted(true);
  };

  const handleDecline = () => {
    clearCall();
  };

  return (
    <>
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-start justify-center pointer-events-none">
        <div
          className={cn(
            'pointer-events-auto',
            'w-full sm:max-w-sm',
            'mx-0 sm:mx-4',
            'mb-[max(env(safe-area-inset-bottom)+16px,16px)] sm:mb-0',
            'sm:mx-auto'
          )}
        >
          <div
            className={cn(
              'bg-surface-card rounded-2xl sm:rounded-2xl',
              'shadow-2xl shadow-black/20',
              'border border-border2',
              'p-4 sm:p-5',
              'animate-in slide-in-from-bottom-4 sm:slide-in-from-top-4 fade-in duration-300'
            )}
          >
            <div className="flex items-center gap-4">
              {/* Caller avatar / icon */}
              <div className="w-11 h-11 rounded-xl bg-blue-3a flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-blue-10 animate-pulse" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-text font-semibold text-[15px] leading-5 truncate">
                  {callerName ?? 'Incoming Call'}
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  {role === 'DOCTOR'
                    ? 'Patient'
                    : role === 'SEEKER'
                      ? 'Doctor'
                      : 'User'}{' '}
                  is calling you
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDecline}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'bg-red-100 dark:bg-red-500/20',
                    'text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30',
                    'transition-colors cursor-pointer'
                  )}
                  aria-label="Decline call"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
                <button
                  onClick={handleAccept}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center',
                    'bg-green-100 dark:bg-green-500/20',
                    'text-green-600 hover:bg-green-200 dark:hover:bg-green-500/30',
                    'transition-colors cursor-pointer'
                  )}
                  aria-label="Accept call"
                >
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
