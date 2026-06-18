// components/availability/SetAvailabilityModal.tsx
'use client';

import Toggle from '@/components/Base/Toggle';
import Modal from '@/components/Ui/Modal';
import { CalendarIconLocal } from '@/icons/DashboardNavIcons';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import AddSessionModal from './AddSessionModal';
import DeleteSessionModal from './DeleteSessionModal';

export type DayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type ConsultationType = 'video' | 'home' | 'clinic';

export interface Session {
  id: string;
  consultationType: ConsultationType;
  startTime: string; // "10:00 AM"
  endTime: string; // "10:20 AM"
}

export type AvailabilityByDay = Record<DayKey, Session[]>;

const DAYS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const CONSULTATION_LABELS: Record<ConsultationType, string> = {
  video: 'Video consultation',
  home: 'Home consultation',
  clinic: 'Clinic consultation',
};

interface SetAvailabilityModalProps {
  open: boolean;
  onClose: () => void;
  initialAvailability?: AvailabilityByDay;
  onSave?: (availability: AvailabilityByDay) => void;
}

const emptyAvailability: AvailabilityByDay = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function SetAvailabilityModal({
  open,
  onClose,
  initialAvailability = emptyAvailability,
  onSave,
}: SetAvailabilityModalProps) {
  const [available, setAvailable] = useState(true);
  const [sameWeekendTiming, setSameWeekendTiming] = useState(false);
  const [availability, setAvailability] =
    useState<AvailabilityByDay>(initialAvailability);

  // Sub-modal states
  const [addingForDay, setAddingForDay] = useState<DayKey | null>(null);
  const [deletingSession, setDeletingSession] = useState<{
    day: DayKey;
    sessionId: string;
  } | null>(null);

  const handleAddSession = (day: DayKey, session: Omit<Session, 'id'>) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: [...prev[day], { ...session, id: `${day}-${Date.now()}` }],
    }));
    setAddingForDay(null);
  };

  const handleDeleteSession = () => {
    if (!deletingSession) return;
    setAvailability((prev) => ({
      ...prev,
      [deletingSession.day]: prev[deletingSession.day].filter(
        (s) => s.id !== deletingSession.sessionId
      ),
    }));
    setDeletingSession(null);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title="Set Availability"
        description="Set your work availability to help us match you with suitable tasks"
        size="md"
      >
        <div className="mt-5 flex flex-col gap-5">
          {/* Top toggles */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Availability</span>
              <Toggle value={available} onChange={setAvailable} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">
                Same timing for weekends
              </span>
              <Toggle
                value={sameWeekendTiming}
                onChange={setSameWeekendTiming}
                disabled={!available}
              />
            </div>
          </div>

          {/* Days list */}
          <div
            className={cn(
              'flex flex-col gap-3',
              !available && 'opacity-50 pointer-events-none'
            )}
          >
            {DAYS.map(({ key, label }) => {
              const sessions = availability[key];
              const hasSessions = sessions.length > 0;

              return (
                <div key={key} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarIconLocal className="w-4 h-4 text-text-muted" />
                      <span className="text-sm font-semibold text-text">
                        {label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddingForDay(key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-10 text-foreground text-xs font-medium hover:bg-blue-11 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Add session
                    </button>
                  </div>

                  {hasSessions && (
                    <div className="flex flex-col gap-2">
                      {sessions.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          onDelete={() =>
                            setDeletingSession({
                              day: key,
                              sessionId: session.id,
                            })
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              onSave?.(availability);
              onClose();
            }}
            className="hidden"
            aria-hidden
          />
        </div>
      </Modal>

      {/* Add Session sub-modal */}
      {addingForDay && (
        <AddSessionModal
          open={!!addingForDay}
          day={addingForDay}
          onClose={() => setAddingForDay(null)}
          onSave={(session) => handleAddSession(addingForDay, session)}
        />
      )}

      {/* Delete confirmation sub-modal */}
      {deletingSession && (
        <DeleteSessionModal
          open={!!deletingSession}
          onClose={() => setDeletingSession(null)}
          onConfirm={handleDeleteSession}
        />
      )}
    </>
  );
}

interface SessionCardProps {
  session: Session;
  onDelete: () => void;
}

function SessionCard({ session, onDelete }: SessionCardProps) {
  return (
    <div className="flex items-center justify-between bg-blue-2 rounded-xl px-4 py-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text">
          {session.startTime} to {session.endTime}
        </span>
        <div className="flex items-center gap-1.5">
          <ConsultationIcon type={session.consultationType} />
          <span className="text-xs text-text-muted">
            {CONSULTATION_LABELS[session.consultationType]}
          </span>
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Delete session"
        className="text-text-muted hover:text-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ConsultationIcon({ type }: { type: ConsultationType }) {
  // Tiny placeholder icons — replace with your actual lucide icons or custom SVGs
  if (type === 'video') return <span className="text-xs">▶</span>;
  if (type === 'clinic') return <span className="text-xs">🏥</span>;
  return <span className="text-xs">🏠</span>;
}
