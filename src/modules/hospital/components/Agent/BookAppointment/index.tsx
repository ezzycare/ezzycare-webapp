import StateModal from '@/components/Base/StateModal';
import React, { useState } from 'react';
import AppointmentPending from './AppointmentPending';
import BookingType from './Bookingtype';
import CreateAppointment from './CreateAppointment';
import CreatePatientModal from './CreatePatientModal';
import SelectCareType from './SelectCareType';
import SelectDoctor from './SelectDoctor';
import SelectSpecialty from './SelectSpecialty';
import { StateType } from './type';

const BookAppointment = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [state, setState] = useState<StateType>('create-patient');
  const [state, setState] = useState<StateType>('book-appointment');

  const closeModal = () => {
    setState('create-patient');
    setOpenModal(false);
  };

  if (!openModal) return null;

  return (
    <>
      {state === 'create-patient' && (
        <CreatePatientModal
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'account-exists' && (
        <StateModal
          open={openModal}
          onClose={closeModal}
          type="info"
          title="Account Exists"
          content="An account with this email already exists. Please proceed to book an appointment."
          btnText="Proceed to Book"
          btnAction={() => setState('book-patient')}
          persistent
        />
      )}

      {state === 'account-created' && (
        <StateModal
          open={openModal}
          onClose={closeModal}
          type="success"
          title="Account Created!"
          content="An account has been created for this patient. Please proceed to booking an appointment."
          btnText="Proceed to Book"
          btnAction={() => setState('book-patient')}
          persistent
        />
      )}

      {state === 'book-patient' && (
        <BookingType
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'select-care-type' && (
        <SelectCareType
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'select-specialty' && (
        <SelectSpecialty
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'out-of-scope' && (
        <StateModal
          open={openModal}
          onClose={closeModal}
          type="info"
          title="Out of Scope"
          content="This care type is out of scope for this hospital."
          btnText="Transfer Booking"
          btnAction={closeModal}
          persistent
        />
      )}

      {state === 'select-doctor' && (
        <SelectDoctor
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'book-appointment' && (
        <CreateAppointment
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}

      {state === 'appointment-pending' && (
        <AppointmentPending
          openModal={openModal}
          setOpenModal={closeModal}
          setState={setState}
        />
      )}
    </>
  );
};

export default BookAppointment;
