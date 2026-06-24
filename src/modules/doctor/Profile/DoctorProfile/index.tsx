/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { User } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useUpdateDoctorProfileMutation } from '@/apiQuery/doctor/profile/updateProfile';
import Tabs from '@/components/Base/Tabs';
import { toaster } from '@/lib/toaster';
import { Dot } from 'lucide-react';
import { useState } from 'react';
import ConsultationCharges from './ConsultationCharges';
import PersonalInfo from './PersonalInfo';

const DoctorProfileComp = ({
  user,
  initials,
}: {
  user: DoctorProfile | User;
  initials: string;
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileValueChanged, setProfileValueChanged] = useState(false);
  const [consultationCharges, setConsultationCharges] = useState({
    homeConsultationCharge:
      user?.userDetails?.homeConsultationCharge || undefined,
    clinicConsultationCharge:
      user?.userDetails?.clinicConsultationCharge || undefined,
    videoConsultationCharge:
      user?.userDetails?.videoConsultationCharge || undefined,
  });

  const { mutate, isPending } = useUpdateDoctorProfileMutation();

  const handleConsultationChargeChange = (
    charges: { key: string; value: string }[]
  ) => {
    const details = user?.userDetails as Record<string, unknown> | undefined;

    const hasChanges = charges.some(
      ({ key, value }) => String(details?.[key] ?? '') !== value
    );

    if (hasChanges) {
      const updated: any = {};
      charges.forEach(({ key, value }) => {
        updated[key] = Number(value);
      });
      setConsultationCharges(updated);
    }

    setProfileValueChanged(hasChanges);
  };

  const handleUpdateProfile = () => {
    if (Object.values(consultationCharges)?.some((value) => value === null)) {
      return;
    }
    mutate(
      { ...consultationCharges },
      {
        onSuccess: () => {
          setProfileValueChanged(false);
          toaster.success('Profile updated successfully');
        },
        onError: () => {
          toaster.error('Failed to update profile');
        },
      }
    );
  };

  const tabs = [
    { title: 'About', component: <PersonalInfo user={user} /> },
    {
      title: 'Consultation charges',
      component: (
        <ConsultationCharges
          user={user}
          onChange={handleConsultationChargeChange}
        />
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="bg-surface-card rounded-[10px] p-4">
        <header className="flex items-center gap-3">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.firstName}
              width={40}
              height={40}
            />
          ) : (
            <p
              className={cn(
                `bg-blue-11a w-10 h-10 rounded-full flex items-center justify-center
                  uppercase text-sm text-surface-card tracking-wider`
              )}
            >
              {initials}
            </p>
          )}

          <div>
            <p className="text-base font-medium text-text">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-text-muted">{user.email}</p>
          </div>

          <Button
            className="relative ml-auto bg-blue-3a! text-blue-11! px-5! py-1.75! rounded-full!"
            disabled={!profileValueChanged}
            onClick={handleUpdateProfile}
          >
            Save
            {profileValueChanged && (
              <Dot
                size={40}
                className="text-blue-11 absolute -top-2 -right-2"
              />
            )}
          </Button>
        </header>
      </div>

      <div className="bg-surface-card rounded-[10px] p-4 mt-3">
        <Tabs
          tabItems={tabs.map((tab) => tab.title)}
          setActiveIndex={(index) => setActiveTab(index)}
        />

        <div className="mt-4">{tabs[activeTab].component}</div>
      </div>
    </div>
  );
};

export default DoctorProfileComp;
