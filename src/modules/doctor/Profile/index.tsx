'use client';

import { User } from '@/apiQuery/auth/types';
import { useGetDoctorProfileQuery } from '@/apiQuery/doctor/profile/getProfile';
import IconBase from '@/components/layout/IconBase';
import { cn } from '@/lib/utils';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { getInitials } from '@/utils/helper';
import Image from 'next/image';

import Button from '@/components/Ui/Button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { LogoutIconLocal, UserIconLocal } from '@/icons/DashboardNavIcons';
import {
  MedicalRecordsIconLocal,
  SettingsWalletIconLocal,
  ShareIconLocal,
} from '@/icons/SettingsIcons';
import { HeartIcon } from '@radix-ui/react-icons';
import {
  ArrowLeft,
  ChevronRight,
  Edit,
  Headphones,
  MapPin,
  Settings as SettingsIcon,
} from 'lucide-react';
import { useState } from 'react';
import AccountSettings from './AccountSettings';
import CustomerSupport from './CustomerSupport';
import DoctorProfileComp from './DoctorProfile';
import LogoutConfirmation from './LogoutConfirmation';
import SeekerAddress from './SeekerAddress';
import SeekerFavorites from './SeekerFavorites';
import SeekerMedicalRecords from './SeekerMedicalRecords';
import SeekerWallet from './SeekerWallet';
import ShareApp from './ShareApp';

const DoctorProfileSettings = () => {
  const isMobile = useIsMobile();

  const [currentView, setCurrentView] = useState(isMobile ? '' : 'Profile');
  const { user: authUser } = useAuthStore((state: AuthStore) => state);
  const { doctorProfile } = useGetDoctorProfileQuery();

  const user = (doctorProfile as unknown as User | null) ?? authUser;
  const initials = user
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : '';

  const settingsItems = [
    {
      title: 'Profile',
      description: 'Update profile',
      icon: <UserIconLocal className="text-text-alt" />,
      component: <DoctorProfileComp user={user} initials={initials} />,
    },
    {
      title: 'Banking details',
      description: 'Manage your bank details',
      icon: <SettingsWalletIconLocal className="text-text-alt" />,
      component: <SeekerWallet user={user} initials={initials} />,
    },
    {
      title: 'Time settings',
      description: 'Manage time sessions',
      icon: <MedicalRecordsIconLocal className="text-text-alt" />,
      component: <SeekerMedicalRecords />,
    },
    {
      title: 'Payout history',
      description: 'View payment history',
      icon: <MedicalRecordsIconLocal className="text-text-alt" />,
      component: <SeekerMedicalRecords />,
    },
    {
      title: 'Urgent requests',
      description: 'Set criteria for urgent requests',
      icon: <HeartIcon className="text-text-alt" />,
      component: <SeekerFavorites />,
    },
    {
      title: 'Address',
      description: 'Update your address',
      icon: <MapPin size={15} className="text-text-alt" />,
      component: <SeekerAddress />,
    },
    {
      title: 'Settings',
      description: 'Manage your account',
      icon: <SettingsIcon size={15} className="text-text-alt" />,
      component: <AccountSettings />,
    },
    {
      title: 'Share App',
      description: 'Share with friends',
      icon: <ShareIconLocal className="text-text-alt" />,
      component: <ShareApp user={user} initials={initials} />,
    },
    {
      title: 'Customer support',
      description: 'Contact our support team',
      icon: <Headphones size={15} className="text-text-alt" />,
      component: <CustomerSupport />,
    },
    {
      title: 'Logout',
      description: 'Logout of your account',
      icon: <LogoutIconLocal className="text-text-alt" />,
      component: <LogoutConfirmation />,
    },
  ];

  const selectedComponent = settingsItems.find(
    (item) => item.title === currentView
  )?.component;

  if (isMobile && currentView !== '') {
    return (
      <div className="h-full flex flex-col bg-surface-card">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-4 bg-surface-card sticky top-0 z-10">
          <button
            onClick={() => setCurrentView('')}
            className="p-1 -ml-1 cursor-pointer"
          >
            <ArrowLeft size={20} className="text-text" />
          </button>
          <p className="text-base font-semibold text-text">{currentView}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4">{selectedComponent}</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-surface-card">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-4 bg-surface-card sticky top-0 z-10">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.firstName}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <p
              className={cn(
                `bg-blue-11a w-9 h-9 rounded-full flex items-center justify-center
                uppercase text-sm text-surface-card tracking-wider`
              )}
            >
              {initials}
            </p>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
          <Button className="ml-auto py-1.75! px-2.5! bg-blue-3a! text-blue-11! text-sm gap-2">
            <Edit size={14} />
            Edit profile
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {settingsItems.slice(0).map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 px-3 py-3.5 cursor-pointer active:bg-gray-2 transition-colors"
              onClick={() => setCurrentView(item.title)}
            >
              <IconBase className="h-9 w-9 shrink-0">{item.icon}</IconBase>

              <div className="flex-1 min-w-0 border-b border-gray-4 pb-3.5">
                <p className="text-sm font-medium text-text">{item.title}</p>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="m-7.5 p-7.5 min-h-[60vh] grid grid-cols1 md:grid-cols-[353px_1fr] gap-7.5 bg-surface-card rounded-[16px]">
      <div className="flex flex-col">
        <ProfileHeader user={user} initials={initials} />

        <div className="flex flex-col gap-2 mt-3">
          {settingsItems.map((item) => (
            <div
              key={item.title}
              className={cn(
                `flex items-center gap-3 px-5 py-3.25 border border-blue-3a rounded-[12px] cursor-pointer
                  ${currentView === item.title ? 'bg-blue-2a' : ''}
                `
              )}
              onClick={() => setCurrentView(item.title)}
            >
              <IconBase className="h-10 w-10">{item.icon}</IconBase>

              <div>
                <p className="text-base font-medium text-text">{item.title}</p>
                <p className="text-sm text-text-muted">{item.description}</p>
              </div>

              <ChevronRight size={16} className="ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[12px] bg-blue-2 p-3">{selectedComponent}</div>
    </div>
  );
};

const ProfileHeader = ({
  user,
  initials,
}: {
  user: User | null;
  initials: string;
}) => (
  <header className="flex items-center gap-3 mb-2">
    {user?.profileImage ? (
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
        {user?.firstName} {user?.lastName}
      </p>
      <p className="text-xs text-text-muted">{user?.email}</p>
    </div>
    <Button className="ml-auto py-1.75! px-2.5! bg-blue-3a! text-blue-11! text-sm gap-2">
      <Edit size={14} />
      Edit profile
    </Button>
  </header>
);

export default DoctorProfileSettings;
