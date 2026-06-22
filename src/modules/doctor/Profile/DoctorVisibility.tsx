'use client';

import Toggle from '@/components/Base/Toggle';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

const DoctorVisibility = () => {
  const doctorUser = useAuthStore((state) => state.doctorUser);

  const [isPrivate, setIsPrivate] = useState(doctorUser.status === 'ACTIVE');

  const hospitals = doctorUser?.hospitals || [];

  const handleSetPrivate = () => {
    setIsPrivate(!isPrivate);
  };

  const handleSetHospitalVisibility = () => {
    //
  };

  return (
    <div className="bg-surface-card rounded-[10px] p-4 sm:y-6.5 sm:px-10">
      <h4 className="font-medium text-text">Workspace Visibility Settings</h4>
      <p className="text-sm text-text-muted">
        Only active workspaces will be visible to care seekers in searches,
        recommendations, and for bookings. Turning off a workspace will not
        affect existing appointments
      </p>

      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-[1fr_45px] items-center gap-2 py-2.5 px-3 border border-border2 rounded-xl">
          <div>
            <p className="text-sm font-medium text-text">Private</p>
            <p className="text-sm text-text-muted">
              Set visibility for your personal workspace
            </p>
          </div>
          <Toggle value={isPrivate} onChange={handleSetPrivate} />
        </div>

        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            className="grid grid-cols-[1fr_45px] items-center gap-2 py-2.5 px-3 border border-border2 rounded-xl"
          >
            <div>
              <p className="text-sm font-medium text-text">
                {hospital.hospitalName}
              </p>
              <p className="text-sm text-text-muted">
                Set visibility for {hospital.hospitalName}
              </p>
            </div>
            <Toggle
              value={hospital.status === 'ACTIVE'}
              onChange={handleSetHospitalVisibility}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorVisibility;
