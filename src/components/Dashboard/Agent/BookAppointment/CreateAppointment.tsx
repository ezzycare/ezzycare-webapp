import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import TextArea from '@/components/Ui/TextArea';
import { TextInput } from '@/components/Ui/TextInput';
import { formatCurrency } from '@/utils/helper';
import { timeSlotGenerator } from '@/utils/timeSlotsGenerator';
import { CircleDollarSign } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import DateTimePicker, { SelectedSlotDisplay } from './DateTimePicker';
import DoctorCard from './DoctorCard';
import { doctors } from './sampleDoctors';
import { SelectDoctorType, StateType } from './type';

const TIME_INTERVAL = 30; // minutes

const CreateAppointment = ({
  openModal,
  setOpenModal,
  setState,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  const doctor: SelectDoctorType = doctors[0];
  const consultationType = ['Video', 'Home', 'Clinic'];

  const [selectedConsultationType, setSelectedConsultationType] = useState(
    consultationType[0]
  );
  const [isSelectingTime, setIsSelectingTime] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<{
    date: Date;
    timeSlot: string;
  } | null>(null);

  const getConsultationFee = useMemo(() => {
    const retrieved =
      doctor.consultationCharges[
        selectedConsultationType?.toLowerCase() as 'home' | 'video' | 'clinic'
      ];

    return `${formatCurrency(retrieved * TIME_INTERVAL)}/${TIME_INTERVAL} mins`;
  }, [doctor.consultationCharges, selectedConsultationType]);

  const blockedDates: Date[] = [
    new Date(2025, 5, 7), // June 7
    new Date(2025, 5, 8), // June 8
    new Date(2025, 5, 9), // June 9
    new Date(2025, 5, 10), // June 10
    new Date(2025, 5, 11), // June 11
    new Date(2025, 5, 12), // June 12
  ];

  const timeSlots = [...timeSlotGenerator(8, 17, TIME_INTERVAL)];

  const blockedTimesByDate = {
    '2025-06-13': ['11:30'], // block 11:30 slot on June 13
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      size="md"
      showCloseButton
      persistent
    >
      <div className="flex flex-col">
        {!isSelectingTime && (
          <div className="flex flex-col space-y-4">
            <DoctorCard key={doctor.id} doctor={doctor} />

            <div>
              <p className="text-base text-text font-semibold">
                Consultation type
              </p>

              <div className="flex items-center gap-5.75 mt-2">
                {consultationType.map((type) => (
                  <div key={type} className="flex items-center gap-2">
                    <RadioItem
                      name="consultationTypes"
                      checked={selectedConsultationType === type}
                      option={{ value: type }}
                      onChange={() => setSelectedConsultationType(type)}
                    />
                    <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                      {type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="text-lg! py-2.75! w-full"
              onClick={() => setIsSelectingTime(true)}
            >
              Select appointment time
            </Button>

            {selectedTimes && (
              <SelectedSlotDisplay
                interval={TIME_INTERVAL}
                slots={timeSlots}
                selectedDate={selectedTimes?.date}
                selectedSlot={selectedTimes?.timeSlot}
                className="bg-blue-3a text-blue-11 shadow-none!"
              />
            )}

            <div
              className="flex items-center justify-between gap-2 text-pink-12a
                text-xs w-full px-4 sm:px-9 py-4.5 bg-pink-3a rounded-xl"
            >
              <div className="flex items-center gap-2">
                <CircleDollarSign size={16} />
                <p>Consultation Fee</p>
              </div>
              <p>{getConsultationFee}</p>
            </div>

            <div className="w-full">
              <p className="text-base text-text font-semibold">Reason</p>
              <TextArea
                placeholder="Please state reason including any symptoms"
                className="mt-2 min-h-38.25!"
              />
            </div>

            <div className="w-full">
              <p className="text-base text-text font-semibold">
                Promocode (optional)
              </p>
              <TextInput placeholder="Enter promo code" className="mt-2" />
            </div>

            <Button
              variant="primary"
              className="text-lg! py-2.75! w-full"
              disabled={!selectedTimes || !selectedConsultationType}
              onClick={() => {
                setState('appointment-pending');
              }}
            >
              Book Appointment
            </Button>
          </div>
        )}

        {isSelectingTime && (
          <div>
            <DateTimePicker
              interval={TIME_INTERVAL}
              blockedDates={blockedDates}
              timeSlots={timeSlots}
              blockedTimesByDate={blockedTimesByDate}
              defaultDate={selectedTimes?.date}
              onSelect={(val: { date: Date; timeSlot: string }) => {
                setSelectedTimes(val);
                setIsSelectingTime(false);
              }}
              applyLabel="Apply"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CreateAppointment;
