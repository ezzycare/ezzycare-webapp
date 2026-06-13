import { appUrl } from '@/apiQuery/baseUrl';
import {
  PaymentParams,
  useInitializePaymentMutation,
} from '@/apiQuery/payment/initiatePayment';
import { usePayWithWalletMutation } from '@/apiQuery/payment/payWithWallet';
import { toaster } from '@/lib/toaster';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { useMemo } from 'react';

export const usePaymentHandlers = () => {
  const {
    createdAppointment,
    updateBooking,
    updatePaymentReference,
    setCreatedAppointment,
  } = useBookAppointmentStore();

  const { mutate: initiatePayment, isPending: isPendingPayment } =
    useInitializePaymentMutation();
  const { mutate: initiateWalletPayment, isPending: isPendingWalletPayment } =
    usePayWithWalletMutation();

  const handlePayment = (paymentMethod: string) => {
    if (!createdAppointment) return;

    const payload = {
      amount: createdAppointment.totalCharge,
      email: createdAppointment.email,
      appointmentId: Number(createdAppointment.id),
      callbackUrl: `${appUrl}/payment/callback`,
    };

    if (paymentMethod === 'wallet') {
      handleWalletPayment(payload);
    } else {
      handleOnlinePayment(payload);
    }
  };

  const handleWalletPayment = (payload: PaymentParams) => {
    initiateWalletPayment(payload, {
      onSuccess: () => {
        updateBooking({ state: 'appointment-pending' });
        setCreatedAppointment(null);
      },
      onError: (error: Error | unknown) => {
        toaster.error(
          (error as Error)?.message || 'Failed to initialize payment'
        );
      },
    });
  };

  const handleOnlinePayment = (payload: PaymentParams) => {
    initiatePayment(payload, {
      onSuccess: (res) => {
        if (res.data?.data?.authorization_url) {
          updatePaymentReference(res.data?.data);
          updateBooking({ state: 'select-payment' });
          setCreatedAppointment(null);
          window.location.href = res.data?.data?.authorization_url;
        }
      },
      onError: (error: Error | unknown) => {
        toaster.error(
          (error as Error)?.message || 'Failed to initialize payment'
        );
      },
    });
  };

  return {
    handlePayment,
    handleWalletPayment,
    handleOnlinePayment,
    isPendingPayment,
    isPendingWalletPayment,
  };
};

export const useModalNavigation = (allStates: string[]) => {
  const state = useBookAppointmentStore((s) => s.state);
  const updateBooking = useBookAppointmentStore((s) => s.updateBooking);

  const goBack = () => {
    const index = allStates.findIndex((item) => item === state);
    if (index > 0) {
      if (['set-filter'].includes(allStates[index - 1])) {
        updateBooking({ state: allStates[index - 2] });
        return;
      }
      updateBooking({ state: allStates[index - 1] });
    }
  };

  const modalClassName = useMemo(() => {
    return ['select-payment'].includes(state)
      ? 'min-h-auto'
      : 'min-h-[60vh] max-h-[90vh] overflow-y-auto';
  }, [state]);

  return { goBack, modalClassName };
};
