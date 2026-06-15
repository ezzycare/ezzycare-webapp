/* eslint-disable react-hooks/set-state-in-effect */
import { Category } from '@/apiQuery/categories/getCategories';
import { ConsultationType } from '@/apiQuery/hospital/types';
import Tabs from '@/components/Base/Tabs';
import Button from '@/components/Ui/Button';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { TextInput } from '@/components/Ui/TextInput';
import { HospitalFiltersType } from '@/stores/bookAppointmentStore';
import { cn } from '@heroui/styles';
import { useEffect, useMemo, useState } from 'react';

const HospitalFilter = ({
  services,
  careTypes,
  careModes,
  setFilters,
  goBack,
}: {
  services: Category[];
  careTypes: { id: number; name: string }[];
  careModes: { id: number; name: ConsultationType }[];
  filters?: HospitalFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<HospitalFiltersType>>;
  goBack: () => void;
}) => {
  const tabs = ['Doctor Service', 'Appointment Type'];
  const [activeTab, setActiveTab] = useState(0);
  const [selectedService, setSelectedService] = useState('');

  const [currentFilters, setCurrentFilters] = useState<HospitalFiltersType>({});

  const allServices = useMemo(() => {
    return [{ id: 0, name: 'All' }, ...services];
  }, [services]);

  useEffect(() => {
    setCurrentFilters((prev) => ({
      ...prev,
      search: undefined,
    }));
    setFilters({});
  }, []);

  const handleSetFilters = <K extends keyof HospitalFiltersType>(
    key: K,
    value: HospitalFiltersType[K]
  ) => {
    setCurrentFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    setFilters((prev) => ({ ...prev, ...currentFilters, search: undefined }));
    goBack();
  };

  return (
    <div className="-mt-4">
      <h3 className="mt-5 font-medium text-base">Filters</h3>
      <div>
        {' '}
        <Tabs tabItems={tabs} setActiveIndex={setActiveTab} />{' '}
      </div>
      {activeTab === 0 && (
        <div className="w-full mt-6">
          <h3 className="font-medium text-base">Search by Location</h3>
          <TextInput
            placeholder="Search by location"
            value={currentFilters.search || ''}
            onChange={(e) => {
              handleSetFilters('search', e.target.value);
            }}
          />

          <h3 className="font-medium text-base">Services</h3>
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-scroll mt-4.25">
            {allServices?.map((service) => (
              <div
                key={service.id}
                className={cn(`
                  flex items-center gap-2 rounded-xl cursor-pointer`)}
                onClick={() => {
                  if (service.name === 'All') {
                    handleSetFilters('services', undefined);
                  } else {
                    handleSetFilters('services', service.name);
                  }
                  setSelectedService((prev) => {
                    const prevArray = prev.split(',');
                    if (prev.includes(service.name)) {
                      return prevArray
                        .filter((item) => item !== service.name)
                        ?.join(',');
                    }
                    return [...prevArray, service.name].join(',');
                  });
                }}
              >
                <RadioItem
                  name="department"
                  checked={
                    currentFilters.services?.includes(service.name) ||
                    selectedService?.includes(service.name)
                  }
                  option={{ value: String(selectedService) }}
                  interactive={false}
                  onChange={() => {}}
                />
                <p className={`text-sm text-text`}>{service.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 1 && <div className="w-full mt-6"></div>}

      <Button
        variant="primary"
        className="w-full mt-8.5"
        onClick={handleApplyFilters}
      >
        Apply filters
      </Button>
    </div>
  );
};

export default HospitalFilter;
