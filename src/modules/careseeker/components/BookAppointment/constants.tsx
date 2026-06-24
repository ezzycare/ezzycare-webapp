import type { ConsultationType } from '@/apiQuery/hospital/types';
import { BoldWalletIcon, PaypalIconLocal } from '@/icons/DashboardIcons';
import type { JSX } from 'react';

export const careTypes: { id: 0 | 1; name: string }[] = [
  { id: 0, name: 'Non-Urgent Care' },
  { id: 1, name: 'Urgent Care' },
];

export const careModes: { id: number; name: ConsultationType }[] = [
  { id: 0, name: 'VIDEO' },
  { id: 1, name: 'HOME' },
  { id: 2, name: 'CLINIC' },
];

export const appointmentTypes: { id: 0 | 1; name: string }[] = [
  { id: 1, name: 'Self' },
  { id: 0, name: 'Others' },
];

export type PaymentMethodType = {
  id: number;
  slug: string;
  name: string;
  icon: JSX.Element;
};

export const paymentMethods: PaymentMethodType[] = [
  {
    id: 0,
    slug: 'wallet',
    name: 'Pay from wallet',
    icon: <BoldWalletIcon />,
  },
  {
    id: 1,
    slug: 'online',
    name: 'Pay Online',
    icon: <PaypalIconLocal />,
  },
];
