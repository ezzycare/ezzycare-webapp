import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { StateType } from './type';

const SelectCareType = ({
  openModal,
  setOpenModal,
  setState,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  const [selectedConsultationType, setSelectedConsultationType] = useState('');
  const [selectedCareType, setSelectedCareType] = useState('');

  const consultationTypes = ['Video', 'Home', 'Clinic'];
  const careTypes = [
    { name: 'Urgent Care' },
    { name: 'Non-Urgent Care' },
    { name: 'Walk-In Mode' },
  ];
  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Care type"
      description="Please select the type of care"
      size="md"
      showCloseButton
      persistent
    >
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-text mt-8">
          Consultation type
        </h3>
        <div className="mt-2 flex text-sm text-text-muted gap-2">
          {consultationTypes.map((consultType, index) => (
            <div
              key={index}
              className={cn(`
                w-1/3 rounded-lg flex items-center justify-between 
                p-5.5 border border-border2 cursor-pointer
              `)}
              onClick={() => setSelectedConsultationType(consultType)}
            >
              <p>{consultType}</p>
              <RadioItem
                name="department"
                checked={selectedConsultationType === consultType}
                option={{ value: consultType }}
                interactive={false}
              />
            </div>
          ))}
        </div>

        <h3 className="text-base font-medium text-text mt-4">Care type</h3>
        <div className="space-y-2 mt-2 flex flex-col text-sm text-text-muted">
          {careTypes.map((careType, index) => (
            <div
              key={index}
              className={cn(
                `rounded-lg flex items-center justify-between p-5.5 border cursor-pointer
                ${selectedCareType === careType.name ? 'border-primary text-primary! font-semibold' : 'border-border2'}
                `
              )}
              onClick={() => {
                setSelectedCareType(careType.name);
              }}
            >
              <div className="flex items-center gap-2">
                <span>{careType.name}</span>
              </div>
              <ChevronRight size={18} className="text-text" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            className="w-full text-white"
            variant="primary"
            disabled={
              !(selectedCareType?.length && selectedConsultationType?.length)
            }
            onClick={() => {
              setState('select-specialty');
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SelectCareType;
