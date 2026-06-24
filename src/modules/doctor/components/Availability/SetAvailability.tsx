/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCreateAvailabilitySlotMutation } from '@/apiQuery/doctor/availability/createAvailability';
import { useDeleteAvailabilitySlotMutation } from '@/apiQuery/doctor/availability/deleteAvailability';
import { useGetDoctorAvailabilityQuery } from '@/apiQuery/doctor/availability/getAvailability';
import { useUpdateAvailabilitySettingsMutation } from '@/apiQuery/doctor/availability/updateSettings';
import Toggle from '@/components/Base/Toggle';
import Button from '@/components/Ui/Button';
import {
  CalendarIconLocal,
  HospitalIconLocal,
} from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { CirclePlus, House, SquarePlay, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
  startTime: string;
  endTime: string;
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

interface SetAvailabilityProps {
  onClose?: () => void;
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

export default function SetAvailability({
  onClose,
  initialAvailability = emptyAvailability,
  onSave,
}: SetAvailabilityProps) {
  const [available, setAvailable] = useState(true);
  const [sameWeekendTiming, setSameWeekendTiming] = useState(false);
  const [availability, setAvailability] =
    useState<AvailabilityByDay>(initialAvailability);

  const [addingForDay, setAddingForDay] = useState<DayKey | null>(null);
  const [deletingSession, setDeletingSession] = useState<{
    day: DayKey;
    sessionId: string;
  } | null>(null);

  const initialSyncDone = useRef(false);

  const {
    availability: availabilityData,
    isLoading,
    refetch,
  } = useGetDoctorAvailabilityQuery();

  const { mutate: createSlot, isPending: isCreating } =
    useCreateAvailabilitySlotMutation();
  const { mutate: deleteSlot, isPending: isDeleting } =
    useDeleteAvailabilitySlotMutation();
  const { mutate: updateSettings } = useUpdateAvailabilitySettingsMutation();

  const syncFromServer = (data: NonNullable<typeof availabilityData>) => {
    const mapped: AvailabilityByDay = { ...emptyAvailability };
    data.slots?.forEach((slot) => {
      const day = slot.day.toLowerCase() as DayKey;
      if (day in mapped) {
        mapped[day].push({
          id: slot.id,
          consultationType:
            slot.consultationType.toLowerCase() as ConsultationType,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    });
    setAvailability(mapped);
    setAvailable(data.settings?.availability === 'ACTIVE');
    setSameWeekendTiming(!!data.settings?.sameTiming);
  };

  // Seed local state from server on first load each time modal opens
  useEffect(() => {
    if (!open) {
      initialSyncDone.current = false;
      return;
    }
    if (!availabilityData || initialSyncDone.current) return;

    initialSyncDone.current = true;
    syncFromServer(availabilityData);
  }, [availabilityData, open]);

  const handleAddSession = (day: DayKey, session: Omit<Session, 'id'>) => {
    createSlot(
      {
        day,
        startTime: session.startTime,
        endTime: session.endTime,
        consultationType: session.consultationType.toUpperCase() as
          | 'VIDEO'
          | 'HOME'
          | 'CLINIC',
      },
      {
        onSuccess: (response) => {
          const created = response.data;
          setAddingForDay(null);
          if (created) {
            setAvailability((prev) => ({
              ...prev,
              [day]: [
                ...prev[day],
                {
                  id: created.id,
                  consultationType:
                    created.consultationType.toLowerCase() as ConsultationType,
                  startTime: created.startTime,
                  endTime: created.endTime,
                },
              ],
            }));
          }
          toaster.success('Session added');
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to add session');
        },
      }
    );
  };

  const handleDeleteSession = () => {
    if (!deletingSession) return;

    deleteSlot(
      { id: deletingSession.sessionId },
      {
        onSuccess: async () => {
          setDeletingSession(null);
          toaster.success('Session deleted');
          const { data: fresh } = await refetch();
          if (fresh?.data) {
            syncFromServer(fresh.data);
          }
        },
        onError: (error: unknown) => {
          const err = error as { message?: string };
          toaster.error(err?.message || 'Failed to delete session');
        },
      }
    );
  };

  const handleAvailableToggle = (value: boolean) => {
    setAvailable(value);
    updateSettings({
      sameTiming: sameWeekendTiming ? 1 : 0,
      availability: value ? 'ACTIVE' : 'INACTIVE',
    });
  };

  const handleSameTimingToggle = (value: boolean) => {
    setSameWeekendTiming(value);
    updateSettings({
      sameTiming: value ? 1 : 0,
      availability: available ? 'ACTIVE' : 'INACTIVE',
    });
  };

  return (
    <>
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-text-muted">
              Loading availability...
            </span>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-5">
            {/* Top toggles */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">Availability</span>
                <Toggle value={available} onChange={handleAvailableToggle} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text">
                  Same timing for weekends
                </span>
                <Toggle
                  value={sameWeekendTiming}
                  onChange={handleSameTimingToggle}
                  disabled={!available}
                />
              </div>
            </div>

            {/* Days list */}
            <div
              className={cn(
                'flex flex-col gap-3.25',
                !available && 'opacity-50 pointer-events-none'
              )}
            >
              {DAYS.map(({ key, label }) => {
                const rawSessions = availability[key];
                const hasSessions = rawSessions.length > 0;

                const sessions: Session[] = [];

                for (const session of rawSessions) {
                  if (!sessions.find((val) => val.id === session.id)) {
                    sessions.push(session);
                  }
                }

                return (
                  <div key={key} className="flex flex-col gap-2 py-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIconLocal className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-text">
                          {label}
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setAddingForDay(key)}
                        disabled={isCreating || isDeleting}
                        className="flex text-xs items-center gap-1.5 px-3! py-1.5!"
                      >
                        <CirclePlus className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Add session
                      </Button>
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
                onClose?.();
              }}
              className="hidden"
              aria-hidden
            />
          </div>
        )}
      </div>

      {addingForDay && (
        <AddSessionModal
          open={!!addingForDay}
          day={addingForDay}
          isLoading={isCreating}
          onClose={() => setAddingForDay(null)}
          onSave={(session) => handleAddSession(addingForDay, session)}
        />
      )}

      {deletingSession && (
        <DeleteSessionModal
          open={!!deletingSession}
          isLoading={isDeleting}
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
    <div className="flex items-center justify-between bg-gray-2 rounded-lg px-4 py-3">
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
        className="text-text-alt hover:text-text transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function ConsultationIcon({ type }: { type: ConsultationType }) {
  if (type === 'video')
    return (
      <span className="text-xs">
        <SquarePlay size={14} className="text-text-muted" />
      </span>
    );
  if (type === 'clinic')
    return (
      <span className="text-xs">
        <HospitalIconLocal size={14} className="text-text-muted" />
      </span>
    );
  return (
    <span className="text-xs">
      <House size={14} className="text-text-muted" />
    </span>
  );
}
