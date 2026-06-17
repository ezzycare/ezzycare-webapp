'use client';

import {
  GetSingleAppointmentType,
  useGetAppointmentQuery,
} from '@/apiQuery/healthcareAppointments/get/getSingleAppointment';
import SpiralLoader from '@/components/Base/SpiralLoader';
import AppointmentDetails from '@/modules/careseeker/components/Appointments/AppointmentDetails';
import { useParams } from 'next/navigation';

const BookingDetail = () => {
  const params = useParams();

  const id = Number(params.id);

  const { appointment, isFetching } = useGetAppointmentQuery({
    id,
  });

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl min-h-[70vh]">
      {/* <BookingDetails booking={booking} /> */}
      {isFetching && (
        <div className="w-full h-[60vh] flex items-center justify-center">
          <SpiralLoader />
        </div>
      )}

      {!isFetching && (
        <>
          <AppointmentDetails
            appointment={appointment || ({} as GetSingleAppointmentType)}
          />
        </>
      )}
    </div>
  );
};

export default BookingDetail;
