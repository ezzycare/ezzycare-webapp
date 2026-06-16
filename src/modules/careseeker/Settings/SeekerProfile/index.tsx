'use client';

import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { User } from '@/apiQuery/auth/types';
import Tabs from '@/components/Base/Tabs';
import { useState } from 'react';
import MedicalInfo from './MedicalInfo';
import PersonalInfo from './PersonalInfo';
import TestReportInfo from './TestReportInfo';

const SeekerProfile = ({
  user,
  initials,
}: {
  user: User;
  initials: string;
}) => {
  const tabs = [
    { title: 'Personal', component: <PersonalInfo user={user} /> },
    { title: 'Medical', component: <MedicalInfo user={user} /> },
    { title: 'Test Reports', component: <TestReportInfo user={user} /> },
  ];
  const [activeTab, setActiveTab] = useState(0);

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

          <Button className="ml-auto bg-blue-3a! text-blue-11! px-2.5! py-1.75!">
            Save
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

export default SeekerProfile;
