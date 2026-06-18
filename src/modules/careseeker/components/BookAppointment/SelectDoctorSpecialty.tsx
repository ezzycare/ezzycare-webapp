import { Category } from '@/apiQuery/categories/getCategories';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { cn } from '@/lib/utils';
import React, { useMemo } from 'react';

const SelectDoctorSpecialty = ({
  specialties,
  selectedSpecialty,
  setSelectedSpecialty,
  action,
}: {
  specialties: Category[];
  selectedSpecialty: string;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string>>;
  action: () => void;
}) => {
  const allSpecialties = useMemo(() => {
    return [{ id: 0, name: 'All' }, ...specialties];
  }, [specialties]);

  const handleSelectSpecialty = (name: string) => {
    setSelectedSpecialty(name);
    setTimeout(() => {
      action();
    }, 500);
  };

  return (
    <div>
      <h3 className="mt-5 font-medium text-base">
        What Doctor would you like to see?
      </h3>

      <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-scroll mt-3">
        {allSpecialties?.map((specialty) => {
          const isActive = selectedSpecialty === specialty.name;
          return (
            <div
              key={specialty.id}
              className={cn(`
                group flex items-center gap-2 p-4 rounded-xl cursor-pointer
                hover:border hover:border-primary
                ${isActive ? 'bg-primary' : 'bg-gray-3'}`)}
              onClick={() => handleSelectSpecialty(specialty.name)}
            >
              <RadioItem
                name="department"
                checked={isActive}
                option={{ value: String(selectedSpecialty) }}
                interactive={false}
                inverted
                onChange={() => {}}
              />
              <p
                className={`text-sm hover:text-text ${isActive ? 'text-surface-card' : 'text-text'}`}
              >
                {specialty.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectDoctorSpecialty;
