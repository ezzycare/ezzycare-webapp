'use client';

import AppointmentPending from '@/modules/hospital/components/Agent/BookAppointment/AppointmentPending';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const reference = searchParams.get('reference');
  const [open, setOpen] = useState(!!reference);

  if (!user) {
    return null;
  }

  if (!reference) {
    return null;
  }

  return (
    <AppointmentPending
      openModal={open}
      setOpenModal={(v) => {
        setOpen(v);
        if (!v) router.push('/dashboard');
      }}
      setState={() => {}}
    />
  );
};

const PaymentCallback = () => (
  <Suspense fallback={null}>
    <CallbackContent />
  </Suspense>
);

export default PaymentCallback;
