'use client';

import type { DoctorUrgentCriteria } from '@/apiQuery/doctor/profile/types';
import { useUpdateDoctorProfileMutation } from '@/apiQuery/doctor/profile/updateProfile';
import { toaster } from '@/lib/toaster';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { Check, RefreshCw } from 'lucide-react';
import { useState } from 'react';

const CONSULTATION_TYPES: { name: string; key: DoctorUrgentCriteria }[] = [
  { name: 'video', key: 'VIDEO' },
  { name: 'home', key: 'HOME' },
  { name: 'clinic', key: 'CLINIC' },
];

const UrgentRequests = () => {
  const doctorUser = useAuthStore((state) => state.doctorUser);
  const updateUser = useAuthStore((state) => state.updateDoctorUser);
  const rawCriteria = doctorUser?.userDetails?.urgentCriteria ?? null;

  const criteriaFromStore: DoctorUrgentCriteria[] =
    typeof rawCriteria === 'string'
      ? (rawCriteria.split(',').filter(Boolean) as DoctorUrgentCriteria[])
      : Array.isArray(rawCriteria)
        ? rawCriteria
        : [];

  const [activeCriteria, setActiveCriteria] = useState<
    Set<DoctorUrgentCriteria>
  >(() => new Set(criteriaFromStore));

  const { mutate: updateProfile, isPending } = useUpdateDoctorProfileMutation();

  const handleToggle = (key: DoctorUrgentCriteria) => {
    setActiveCriteria((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      const criteriaArray = Array.from(next);
      const hasAny = criteriaArray.length > 0;

      updateProfile(
        {
          urgentCriteria: criteriaArray,
          urgent: hasAny ? 1 : 0,
        },
        {
          onSuccess: () => {
            toaster.success('Urgent criteria updated');
            updateUser({
              userDetails: {
                ...doctorUser?.userDetails,
                urgentCriteria: criteriaArray.join(','),
                urgent: hasAny ? 1 : 0,
              },
            } as typeof doctorUser);
          },
          onError: (err: unknown) => {
            toaster.error(
              (err as { message?: string })?.message ?? 'Failed to update'
            );
          },
        }
      );

      return next;
    });
  };

  return (
    <div className="bg-surface-card rounded-[10px] p-7.5">
      <header className="flex items-center gap-3 justify-between">
        <div>
          <h3 className="font-medium text-text">Urgent requests</h3>
          <p className="text-sm text-text">Set criteria for urgent requests</p>
        </div>
        {isPending && (
          <RefreshCw className="w-4 h-4 text-text-muted animate-spin" />
        )}
      </header>

      <div className="mt-7 space-y-2">
        {CONSULTATION_TYPES.map(({ name, key }) => {
          const active = activeCriteria.has(key);

          return (
            <div
              key={key}
              className="flex items-center gap-3 justify-between border border-border2 rounded-2xl py-2.5 px-3"
            >
              <div>
                <p className="text-sm font-medium text-text capitalize">
                  {name}
                </p>
                <p className="text-sm text-text-muted">
                  Urgent availability for {name} consultation
                </p>
              </div>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleToggle(key)}
                className={cn(
                  'w-3.5 h-3.5 rounded-xs flex items-center justify-center shrink-0 transition-colors cursor-pointer',
                  active ? 'bg-primary' : 'border border-gray-5',
                  isPending && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`Toggle ${name} urgent request`}
              >
                {active && <Check size={12} className="text-surface-card" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UrgentRequests;
