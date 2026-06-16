'use client';
import { User } from '@/apiQuery/auth/types';
import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { Info, Share2 } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'react-qr-code';

const ShareApp = ({ user, initials }: { user: User; initials: string }) => {
  return (
    <div>
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

          <Button className="ml-auto rounded-full! bg-blue-3a! text-blue-11! px-2.5! py-1.75!">
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        </header>
      </div>

      <div className="bg-surface-card rounded-[10px] p-4 mt-3">
        <EzzyCareCard user={user} />
      </div>
    </div>
  );
};

export default ShareApp;

export const EzzyCareCard = ({ user }: { user: User }) => {
  const ezzyId = user?.userDetails?.id || '';
  const joinDate = user?.userDetails?.createdAt
    ? dayjs(user.createdAt).format('DD MMMM, YYYY')
    : dayjs().format('DD MMMM, YYYY');

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {/* QR Code */}
        <div className="w-48 h-48 bg-blue-2 rounded-xl border border-blue-3a p-4 mb-4">
          {user?.ezzycareCard || ezzyId ? (
            <div
              style={{
                height: 'auto',
                margin: '0 auto',
                maxWidth: 206,
                width: '100%',
              }}
            >
              <QRCode
                size={256}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                value={user.ezzycareCard || ezzyId}
                viewBox={`0 0 256 256`}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-lg">
              {/* Fallback QR placeholder */}
              <div className="grid grid-cols-5 gap-1 w-32 h-32">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    // eslint-disable-next-line react-hooks/purity
                    className={`${Math.random() > 0.4 ? 'bg-gray-12' : 'bg-transparent'} rounded-sm`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ID Text */}
        <div className="text-center">
          <p className="text-gray-10 text-sm">
            EzzyCare ID:{' '}
            <span className="font-medium text-gray-12">{ezzyId}</span>
          </p>
          <p className="text-gray-10 text-sm mt-1">Joined {joinDate}</p>
        </div>

        {/* Info Note */}
        <div className="mt-8 w-full bg-neutral-3a rounded-xl p-4 flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            <Info size={18} className="text-gray-11" />
          </div>
          <p className="text-sm text-gray-11 leading-relaxed">
            Your QR code is private. Your Doctor can scan it with their EzzyCare
            camera to see your medical history
          </p>
        </div>
      </div>
    </div>
  );
};
