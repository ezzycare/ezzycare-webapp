/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category } from '@/apiQuery/categories/getCategories';
import {
  HospitalDiscoveryItem,
  useGetHospitalDiscovery,
} from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import {
  HospitalProfileType,
  useGetSingleHospital,
} from '@/apiQuery/hospital/discovery/getSingleHospital';
import { ConsultationType } from '@/apiQuery/hospital/types';
import Modal from '@/components/Ui/Modal';
import { BoldWalletIcon, PaypalIconLocal } from '@/icons/DashboardIcons';
import { useModalNavigation } from '@/modules/careseeker/hooks/useAppointmentActions';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { useCategoryStore } from '@/stores/categoryStore';
import React, { JSX, useEffect, useMemo } from 'react';
import AllHospitalsComp from './AllHospitalsComp';
import HospitalFilter from './HospitalFilter';

const allStates = ['select-hospital', 'set-filter'];

const BookHospitalAppointment = ({
  openModal,
  setOpenModal,
  continueAppointment,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  continueAppointment?: () => void;
}) => {
  const {
    hospitalState,
    clickedHospital,
    activeHospitalFilters,
    updateBooking,
    updateHospitalState,
    setCreatedAppointment,
    updatePaymentReference,
  } = useBookAppointmentStore();

  const { goBack, modalClassName } = useModalNavigation(allStates);

  useEffect(() => {
    console.log({ activeHospitalFilters });
  }, [activeHospitalFilters]);

  useEffect(() => {
    updateHospitalState('select-hospital');
  }, []);

  const services =
    useCategoryStore((state) => state.categories.allCategories) ||
    ([] as Category[]);

  const hospitalFilters = useMemo(
    () => activeHospitalFilters ?? {},
    [activeHospitalFilters]
  );

  const {
    hospitals: hospitalsData,
    isFetching: loadingHospitals,
    ...restHospitalQueries
  } = useGetHospitalDiscovery(hospitalFilters);

  const hospitals: HospitalDiscoveryItem[] = useMemo(() => {
    return (
      hospitalsData?.filter(
        (hospital): hospital is HospitalDiscoveryItem => !!hospital
      ) ?? []
    );
  }, [hospitalsData]);

  const { hospital: hospitalData, isFetching: loadingSingleHospital } =
    useGetSingleHospital({
      id: Number(clickedHospital?.id) ?? undefined,
    });

  const hospital = useMemo(() => {
    return hospitalData ? hospitalData : ({} as HospitalProfileType);
  }, [hospitalData]);

  const isLoading = useMemo(() => {
    return loadingHospitals || loadingSingleHospital;
  }, [loadingHospitals, loadingSingleHospital]);

  const handleResetModal = () => {
    updateHospitalState('select-hospital');
    updateBooking({
      // state: 'select-specialty',
      selectedSpecialty: '',
      selectedCareType: 0,
      selectedCareMode: '',
      clickedHospital: null,
      activeHospitalFilters: {},
    });
    setOpenModal(false);
    setCreatedAppointment(null);
    updatePaymentReference(null);
  };

  const handleCloseModal = () => {
    if (hospitalState === 'set-filter') {
      updateHospitalState('select-hospital');
    } else {
      handleResetModal();
    }
  };

  const handleContinueAppointment = () => {
    if (continueAppointment) {
      continueAppointment();
    }
  };

  return (
    <div>
      <Modal open={openModal} onClose={handleCloseModal} size="md" persistent>
        <div className={modalClassName}>
          {hospitalState === 'select-hospital' && (
            <AllHospitalsComp
              isLoading={isLoading}
              hospitals={hospitals}
              firstPageItems={
                restHospitalQueries.data?.pages?.[0]?.data?.items as
                  | HospitalDiscoveryItem[]
                  | undefined
              }
              selectedHospital={hospital}
              hasNextPage={restHospitalQueries.hasNextPage}
              fetchNextPage={restHospitalQueries.fetchNextPage}
              isFetchingNextPage={restHospitalQueries.isFetchingNextPage}
              filters={activeHospitalFilters}
              setFilters={(value) =>
                updateBooking({
                  activeHospitalFilters:
                    typeof value === 'function'
                      ? value(activeHospitalFilters)
                      : value,
                })
              }
              clickedHospital={clickedHospital}
              setClickedHospital={(value: any) =>
                updateBooking({
                  clickedHospital:
                    typeof value === 'function'
                      ? value(clickedHospital)
                      : value,
                  hospitalId: value.id,
                })
              }
              openFilter={() => updateHospitalState('set-filter')}
              action={() => handleContinueAppointment()}
              goBack={goBack}
            />
          )}
          {hospitalState === 'set-filter' && (
            <HospitalFilter
              services={services}
              filters={activeHospitalFilters}
              setFilters={(value) =>
                updateBooking({
                  activeHospitalFilters:
                    typeof value === 'function'
                      ? value(activeHospitalFilters)
                      : value,
                  hospitalState: 'select-hospital',
                })
              }
              goBack={goBack}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookHospitalAppointment;

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

export interface OtherUserData {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  gender: 'MALE' | 'FEMALE' | null;
  age: string | null;
  address: string | null;
  city: string | null;
  reason: string | null;
  promoCode: string | null;
}
