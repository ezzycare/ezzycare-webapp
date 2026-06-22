/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useVerifyReferenceQuery } from '@/apiQuery/payment/verifyReference';
import BounceLoader from '@/components/Base/BounceLoader';
import AppointmentPending from '@/modules/hospital/components/Agent/BookAppointment/AppointmentPending';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const CallbackContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const reference = searchParams.get('reference');
  const [open, setOpen] = useState(!!reference);

  const { isLoading, isSuccess, isError } = useVerifyReferenceQuery(reference);

  useEffect(() => {
    if (isSuccess) {
      setOpen(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setOpen(false);
      router.push('/dashboard');
    }
  }, [isError, router]);

  if (!user) {
    return null;
  }

  if (!reference) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="relative min-h-[60vh]">
        <BounceLoader backdropClassName="bg-transparent" />
      </div>
    );
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
