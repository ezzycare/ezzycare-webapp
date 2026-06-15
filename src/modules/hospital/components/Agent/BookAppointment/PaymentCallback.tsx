'use client';

import AppointmentPending from './AppointmentPending';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isPaymentCallback = searchParams.get('paymentCallback');
  const [open, setOpen] = useState(!!isPaymentCallback);

  const { paymentReference, updatePaymentReference } =
    useBookAppointmentStore();

  useEffect(() => {
    console.log({ paymentReference });
  }, [isPaymentCallback]);

  if (!isPaymentCallback) {
    return null;
  }

  return (
    <AppointmentPending
      openModal={open}
      setOpenModal={(v) => {
        updatePaymentReference(null);
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
