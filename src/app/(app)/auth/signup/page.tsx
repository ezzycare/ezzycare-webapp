'use client';

import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import { RadioItem } from '@/components/Ui/RadioGroup';
import {
    HospitalIconLocal,
    StethoscopeIconLocal,
    UserIconLocal,
} from '@/icons/DashboardNavIcons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');

  const signupTypes = [
    {
      name: 'Care Seeker',
      icon: <UserIconLocal />,
      href: '#',
    },
    {
      name: 'Doctor',
      icon: <StethoscopeIconLocal />,
      href: '',
    },
    {
      name: 'Hospital',
      icon: <HospitalIconLocal />,
      href: 'hospital',
    },
  ];
  return (
    <Card onCancel={() => router.back()}>
      <div className="flex flex-col">
        <h1 className="font-medium text-text text-2xl">Sign Up</h1>
        <p className="text-text-alt text-sm mt-1.5">
          Select what best describes you and create your account
        </p>

        <h3 className="text-base font-semibold text-text mt-5">
          What best describes?
        </h3>
        <div className="space-y-2 mt-2 flex flex-col text-sm text-text-muted">
          {signupTypes.map((signupType, index) => (
            <div
              key={index}
              className="rounded-lg flex items-center justify-between p-5.5 border border-border2 cursor-pointer"
              onClick={() => setSelectedType(signupType.href)}
            >
              <div className="flex items-center gap-2">
                {signupType.icon}
                <span>{signupType.name}</span>
              </div>
              <RadioItem
                name="department"
                checked={selectedType === signupType.href}
                option={{ value: signupType.href }}
                interactive={false}
                onChange={() => {}}
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full text-white"
            variant="primary"
            disabled={!selectedType?.length}
            onClick={() => {
              router.push('/auth/signup/' + selectedType?.toLowerCase());
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default Page;
