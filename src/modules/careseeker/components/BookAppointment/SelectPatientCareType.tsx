import { RadioItem } from '@/components/Ui/RadioGroup';
import { cn } from '@/lib/utils';

const SelectPatientCareType = ({
  careTypes,
  selectedCareType,
  setSelectedCareType,
  action,
}: {
  careTypes: { id: 0 | 1; name: string }[];
  selectedCareType: number;
  setSelectedCareType: React.Dispatch<React.SetStateAction<0 | 1>>;
  action: () => void;
}) => {
  const handleSelectCareType = (id: 0 | 1) => {
    setSelectedCareType(id);
    setTimeout(() => {
      action();
    }, 500);
  };

  return (
    <div>
      <h3 className="mt-5 font-medium text-base">How soon do you want care?</h3>

      <div className="flex flex-col gap-2 max-h-[50vh] mt-3">
        {careTypes?.map((careType) => {
          const isActive = selectedCareType === careType.id;
          return (
            <div
              key={careType.id}
              className={cn(`
                  group flex items-center gap-2 p-4 rounded-xl cursor-pointer
                  hover:border hover:border-primary
                  ${isActive ? 'bg-primary' : 'bg-gray-3'}`)}
              onClick={() => handleSelectCareType(careType.id)}
            >
              <RadioItem
                name="department"
                checked={isActive}
                option={{ value: String(selectedCareType) }}
                interactive={false}
                inverted
                onChange={() => {}}
              />
              <p
                className={`text-sm hover:text-text ${isActive ? 'text-surface-card' : 'text-text'}`}
              >
                {careType.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectPatientCareType;
