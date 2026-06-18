import { RadioItem } from '@/components/Ui/RadioGroup';
import { cn } from '@/lib/utils';
import React from 'react';

const SelectPatientCareMode = ({
  careModes,
  selectedCareMode,
  setSelectedCareMode,
  action,
}: {
  careModes: { id: number; name: string }[];
  selectedCareMode: string;
  setSelectedCareMode: React.Dispatch<React.SetStateAction<string>>;
  action: () => void;
}) => {
  const handleSelectCareMode = (name: string) => {
    setSelectedCareMode(name);
    setTimeout(() => {
      action();
    }, 500);
  };

  return (
    <div>
      <h3 className="mt-5 font-medium text-base">Where do you want care?</h3>

      <div className="flex flex-col gap-2 max-h-[50vh] mt-3">
        {careModes?.map((careMode) => {
          const isActive = selectedCareMode === careMode.name;
          return (
            <div
              key={careMode.id}
              className={cn(`
                group flex items-center gap-2 p-4 rounded-xl cursor-pointer
                hover:border hover:border-primary
                ${isActive ? 'bg-primary' : 'bg-gray-3'}`)}
              onClick={() => handleSelectCareMode(careMode.name)}
            >
              <RadioItem
                name="department"
                checked={isActive}
                option={{ value: String(selectedCareMode) }}
                interactive={false}
                inverted
                onChange={() => {}}
              />
              <p
                className={`text-sm hover:text-text capitalize ${isActive ? 'text-surface-card' : 'text-text'}`}
              >
                {careMode.name?.toLowerCase()} consultation
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectPatientCareMode;
