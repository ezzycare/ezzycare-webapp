import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import {
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import { Info } from 'lucide-react';
import React, { useState } from 'react';
import { StateType } from './type';

const BookingType = ({
  openModal,
  setOpenModal,
  setState,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  const [selectedType, setSelectedType] = useState('');
  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const bookingTypes = [
    { type: 'Doctor', icon: <StethoscopeIconLocal /> },
    { type: 'Hospital', icon: <HospitalIconLocal /> },
  ];
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      size="md"
      showCloseButton
      persistent
    >
      <div className="flex flex-col">
        <span className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-3a text-gray-11a">
          <span className="">
            <Info size={30} className="rotate-180" />
          </span>
        </span>
        <h3 className="text-base font-semibold text-text mt-8">Booking type</h3>
        <div className="space-y-2 mt-2 flex flex-col text-sm text-text-muted">
          {bookingTypes.map((bookingType, index) => (
            <div
              key={index}
              className="rounded-lg flex items-center justify-between p-5.5 border border-border2 cursor-pointer"
              onClick={() => handleSelectType(bookingType.type)}
            >
              <div className="flex items-center gap-2">
                {bookingType.icon}
                <span>{bookingType.type}</span>
              </div>
              <RadioItem
                name="department"
                checked={selectedType === bookingType.type}
                option={{ value: bookingType.type }}
                interactive={false}
              />
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full text-white"
            variant="primary"
            disabled={!selectedType?.length}
            onClick={() => {
              setState('select-care-type');
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BookingType;
