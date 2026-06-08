'use client';

import { ArrowRight, Mail } from 'lucide-react';

import { AppleIcon, FacebookIcon, GoogleIcon } from '@/icons/DashboardIcons'; // replace with yours
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Card from '../Ui/Card';

export default function SelectAuthMode({ action }: { action: () => void }) {
  const router = useRouter();

  return (
    <Card onCancel={() => router.back()}>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-medium tracking-[-0.03em] text-text">
          Sign Up
        </h2>

        <p className="mt-2 text-sm leading-6 text-text-alt">
          Select what best describes you and create your account
        </p>
      </div>

      <p className="mb-4 text-base font-medium text-text">
        How do you want to continue?
      </p>

      {/* Actions */}
      <div className="space-y-3">
        <ContinueButton
          icon={
            <IconWrapper>
              <Mail className="h-5 w-5 text-text-alt" strokeWidth={2} />
            </IconWrapper>
          }
          label="Continue with Email"
          active
          action={() => action()}
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <FacebookIcon className="h-5 w-5" />
            </IconWrapper>
          }
          label="Continue with Facebook"
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <GoogleIcon className="h-5 w-5" />
            </IconWrapper>
          }
          label="Continue with Google"
        />

        <ContinueButton
          icon={
            <IconWrapper>
              <AppleIcon className="h-5 w-5 fill-black" />
            </IconWrapper>
          }
          label="Continue with Apple"
        />
      </div>
    </Card>
  );
}

type ContinueButtonProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  action?: () => void;
};

function ContinueButton({ icon, label, active, action }: ContinueButtonProps) {
  return (
    <button
      className={cn(`
        group flex h-17 w-full items-center justify-between rounded-[12px] border bg-gray-1 px-2 sm:px-4 transition-all cursor-pointer
          ${active ? 'border-blue-7' : 'border-border2 hover:border-primary/40'}
        `)}
      onClick={() => {
        action?.();
      }}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {icon}

        <span className="text-sm sm:text-base font-medium text-text">
          {label}
        </span>
      </div>

      <ArrowRight
        className="h-5 w-5 text-text-muted transition-transform group-hover:translate-x-0.5"
        strokeWidth={2}
      />
    </button>
  );
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-card">
      {children}
    </div>
  );
};
