/* eslint-disable react-hooks/set-state-in-effect */
import {
  Doctor,
  useGetDoctorsDiscoveryQuery,
} from '@/apiQuery/doctor/getDoctorDiscovery';
import {
  DoctorProfile,
  useGetSingleDoctorQuery,
} from '@/apiQuery/doctor/getSingleDoctor';
import {
  Appointment,
  useCreateAppointmentMutation,
} from '@/apiQuery/healthcareAppointments/post/createAppointment';
import { ConsultationType } from '@/apiQuery/hospital/types';
import { useInitializePaymentMutation } from '@/apiQuery/payment/initiatePayment';
import Modal from '@/components/Ui/Modal';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import {
  BookAppointmentStore,
  useBookAppointmentStore,
} from '@/stores/bookAppointmentStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import React, { useEffect, useMemo, useState } from 'react';
import AllDoctorsComp from './AllDoctorsComp';
import BookAppointmentComp from './BookAppointmentComp';
import BookOthers from './BookOthers';
import DoctorFilter from './DoctorFilter';
import SelectDoctorSpecialty from './SelectDoctorSpecialty';
import SelectPatientCareMode from './SelectPatientCareMode';
import SelectPatientCareType from './SelectPatientCareType';

const allStates = [
  'select-specialty',
  'select-care-type',
  'select-care-mode',
  'select-doctor',
  'set-filter',
  'book-appointment',
  'book-others',
  'select-payment',
];

export type DoctorFiltersType = {
  categoryId?: number | undefined;
  type?: ConsultationType | undefined;
  search?: string | undefined;
  rating?: number | undefined;
  countryId?: number | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  distance?: number | undefined;
};

export type AppointmentTimes = {
  appointmentDate: string; // 2026-04-19
  appointmentTime: string; //'10:00 AM',
  appointmentEndTime: string; //'10:30 AM';
};

const BookPatientAppointment = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const bookAppointmentStore = useBookAppointmentStore(
    (state: BookAppointmentStore) => state
  );
  const user = useAuthStore((state: AuthStore) => state.user);
  const [state, setState] = useState<string>('select-specialty');

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedCareType, setSelectedCareType] = useState<0 | 1>(0);
  const [selectedCareMode, setSelectedCareMode] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [promoCode, setPromoCode] = useState<string>('');
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<0 | 1>(
    0
  );

  const [clickedDoctor, setClickedDoctor] = useState<Doctor | null>(null);
  const [activeFilters, setActiveFilters] = useState<DoctorFiltersType>({
    categoryId: undefined,
    type: undefined,
    search: undefined,
    rating: undefined,
    countryId: undefined,
    latitude: undefined,
    longitude: undefined,
    distance: undefined,
  });

  const consultationTypes = careModes.map((item) => item.name);
  const [selectedConsultationType, setSelectedConsultationType] =
    useState<ConsultationType>(consultationTypes[0]);
  const [selectedTimes, setSelectedTimes] = useState<AppointmentTimes | null>(
    null
  );

  const { mutate: initiateBooking, isPending } = useCreateAppointmentMutation();
  const { mutate: initiatePayment, isPending: isPendingPayment } =
    useInitializePaymentMutation();

  const isCreatingBooking = useMemo(() => {
    return isPending || isPendingPayment;
  }, [isPending, isPendingPayment]);

  useEffect(() => {
    if (openModal) {
      setState('select-specialty');
    }
  }, []);

  const showModalHeader = useMemo(
    () =>
      ![
        'select-doctor',
        'set-filter',
        'book-appointment',
        'book-others',
      ].includes(state),
    [state]
  );

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories?.doctors?.children
  );

  const specialties = useMemo(() => {
    return categories?.length ? categories : [];
  }, [categories]);

  const {
    doctors: doctorsData,
    isFetching: loadingDoctors,
    ...restDoctorQueries
  } = useGetDoctorsDiscoveryQuery({ ...activeFilters });

  const doctors: Doctor[] = useMemo(() => {
    return doctorsData?.filter((doctor): doctor is Doctor => !!doctor) ?? [];
  }, [doctorsData]);

  const { doctor: doctorData, isFetching: loadingSingleDoctor } =
    useGetSingleDoctorQuery({
      id: clickedDoctor?.id || '',
    });

  const doctor = useMemo(() => {
    return doctorData ? doctorData : ({} as DoctorProfile);
  }, [doctorData]);

  const isLoading = useMemo(() => {
    return loadingDoctors || loadingSingleDoctor;
  }, [loadingDoctors, loadingSingleDoctor]);

  const handleResetModal = () => {
    setState('select-specialty');
    setSelectedSpecialty('');
    setSelectedCareType(0);
    setSelectedCareMode('');
    setClickedDoctor(null);
    setOpenModal(false);
    setActiveFilters({});
  };

  const handleCloseModal = () => {
    if (state === 'set-filter') {
      setState('select-doctor');
    } else {
      handleResetModal();
    }
  };

  const goBack = () => {
    const index = allStates.findIndex((item) => item === state);
    if (index > 0) {
      setState(allStates[index - 1]);
    }
  };

  const handleCreateAppointment = async () => {
    const payload = {
      userId: Number(doctor.id),
      hospitalId: 1,
      myAppointment: selectedAppointmentType,
      appointmentType: selectedConsultationType,
      urgent: careTypes[selectedCareType].id,
      name: `${user?.firstName} ${user?.lastName}`,
      email: user?.email,
      mobileNo: user?.mobileNo,
      age: '',
      gender: user.gender,
      reason,
      appointmentDate: selectedTimes?.appointmentDate ?? '',
      appointmentTime: selectedTimes?.appointmentTime ?? '',
      appointmentEndTime: selectedTimes?.appointmentEndTime ?? '',
      userServiceId: 1,
      address: user?.userDetails?.address ?? '',
      city: user?.userDetails?.city ?? '',
      country: user?.userDetails?.country ?? '',
      duration: 30,
    };
    initiateBooking(payload, {
      onSuccess: (res) => {
        console.log({ res });
        toaster.success('Appointment created successfully');
      },
      onError: () => {
        toaster.error('Failed to create appointment');
      },
    });
  };

  const handlePay = (appointment: Appointment) => {
    initiatePayment(
      {
        amount: 0,
        email: user.email,
        appointmentId: appointment.id,
        callbackUrl: `${window.location.origin}/payment/callback`,
      },
      {
        onSuccess: (res) => {
          if (res.data?.authorizationUrl) {
            window.location.href = res.data?.authorizationUrl;
          }
        },
        onError: () => toaster.error('Failed to initialize payment'),
      }
    );
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        title={showModalHeader ? 'Book Appointment' : ''}
        description={showModalHeader ? 'Book an appointment with ease' : ''}
        size="md"
        className="min-h-[60vh]"
      >
        <div>
          {state === 'select-specialty' && (
            <SelectDoctorSpecialty
              specialties={specialties}
              selectedSpecialty={selectedSpecialty}
              setSelectedSpecialty={setSelectedSpecialty}
              action={() => setState('select-care-type')}
            />
          )}
          {state === 'select-care-type' && (
            <SelectPatientCareType
              careTypes={careTypes}
              selectedCareType={selectedCareType}
              setSelectedCareType={setSelectedCareType}
              action={() => setState('select-care-mode')}
            />
          )}
          {state === 'select-care-mode' && (
            <SelectPatientCareMode
              careModes={careModes}
              selectedCareMode={selectedCareMode}
              setSelectedCareMode={setSelectedCareMode}
              action={() => setState('select-doctor')}
            />
          )}
          {state === 'select-doctor' && (
            <AllDoctorsComp
              isLoading={isLoading}
              doctors={doctors}
              selectedDoctor={doctor}
              hasNextPage={restDoctorQueries.hasNextPage}
              fetchNextPage={restDoctorQueries.fetchNextPage}
              filters={activeFilters}
              setFilters={setActiveFilters}
              clickedDoctor={clickedDoctor}
              setClickedDoctor={setClickedDoctor}
              openFilter={() => setState('set-filter')}
              action={() => setState('book-appointment')}
              goBack={goBack}
            />
          )}
          {state === 'set-filter' && (
            <DoctorFilter
              specialties={specialties}
              careTypes={careTypes}
              careModes={careModes}
              filters={activeFilters}
              setFilters={setActiveFilters}
              goBack={goBack}
            />
          )}

          {state === 'book-appointment' && (
            <BookAppointmentComp
              doctor={doctor}
              reason={reason}
              setReason={setReason}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              consultationTypes={consultationTypes}
              selectedConsultationType={selectedConsultationType}
              setSelectedConsultationType={setSelectedConsultationType}
              selectedTimes={selectedTimes}
              setSelectedTimes={setSelectedTimes}
              selectedAppointmentType={selectedAppointmentType}
              setSelectedAppointmentType={(value: 0 | 1) => {
                setSelectedAppointmentType(value);
                if (value === 1) {
                  setState('book-others');
                }
              }}
              appointmentTypes={appointmentTypes}
              goBack={goBack}
              action={handleCreateAppointment}
            />
          )}

          {state === 'book-others' && (
            <BookOthers
              goBack={() => setState('book-appointment')}
              action={handleCreateAppointment}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookPatientAppointment;

const careTypes: { id: 0 | 1; name: string }[] = [
  { id: 0, name: 'Non-Urgent Care' },
  { id: 1, name: 'Urgent Care' },
];
const careModes: { id: number; name: ConsultationType }[] = [
  { id: 0, name: 'VIDEO' },
  { id: 1, name: 'HOME' },
  { id: 2, name: 'CLINIC' },
];
const appointmentTypes: { id: 0 | 1; name: string }[] = [
  { id: 0, name: 'Self' },
  { id: 1, name: 'Others' },
];
