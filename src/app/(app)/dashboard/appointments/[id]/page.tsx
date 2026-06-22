'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import CareSeekerAppointmentDetails from '@/modules/careseeker/components/Appointments/CareSeekerAppointmentDetails';
import DoctorAppointmentDetails from '@/modules/doctor/components/Appointments/DoctorAppointmentDetails';
import { useParams } from 'next/navigation';
import { JSX } from 'react';

const BookingDetail = () => {
  const params = useParams();
  const { accountType } = useGetAccountType();

  const details: Record<ACCOUNT_TYPE, JSX.Element> = {
    ADMIN: <div>Admin</div>,
    HOSPITAL: <></>,
    AGENT: <div>Admin</div>,
    DOCTOR: (
      <>
        <DoctorAppointmentDetails />
      </>
    ),
    SEEKER: (
      <>
        <CareSeekerAppointmentDetails />
      </>
    ),
  };

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl min-h-[70vh]">
      {details[accountType]}
    </div>
  );
};

export default BookingDetail;
