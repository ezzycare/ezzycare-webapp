import { Category } from '@/apiQuery/categories/getCategories';
import { ConsultationType } from '@/apiQuery/hospital/types';
import Tabs from '@/components/Base/Tabs';
import Button from '@/components/Ui/Button';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { Slider } from '@/components/Ui/Slider';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { cn } from '@heroui/styles';
import { StarIcon } from '@radix-ui/react-icons';
import { useMemo, useState } from 'react';
import { DoctorFiltersType } from '.';

const DoctorFilter = ({
  specialties,
  careTypes,
  careModes,
  setFilters,
  goBack,
}: {
  specialties: Category[];
  careTypes: { id: number; name: string }[];
  careModes: { id: number; name: ConsultationType }[];
  filters?: DoctorFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<DoctorFiltersType>>;
  goBack: () => void;
}) => {
  const user = useAuthStore((state: AuthStore) => state.user);
  const tabs = ['Doctor Specialty', 'Appointment Type'];
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [searchByCountry, setSearchByCountry] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<DoctorFiltersType>({});
  const [appointmentType, setAppointmentType] = useState<string>('');

  const allSpecialties = useMemo(() => {
    return [{ id: 0, name: 'All' }, ...specialties];
  }, [specialties]);

  const handleSetFilters = <K extends keyof DoctorFiltersType>(
    key: K,
    value: DoctorFiltersType[K]
  ) => {
    const longLat = {
      latitude: user?.latitude ?? undefined,
      longitude: user?.longitude ?? undefined,
    };
    if (key === 'distance') {
      setCurrentFilters((prev) => ({
        ...prev,
        [key]: value,
        ...longLat,
      }));
      return;
    }
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
          <h3 className="font-medium text-base">
            What Doctor would you like to see?
          </h3>

          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-scroll mt-4.25">
            {allSpecialties?.map((specialty) => (
              <div
                key={specialty.id}
                className={cn(`
                  flex items-center gap-2 rounded-xl cursor-pointer`)}
                onClick={() => {
                  if (specialty.name === 'All') {
                    handleSetFilters('categoryId', undefined);
                  } else {
                    handleSetFilters('categoryId', Number(specialty.id));
                  }
                  setSelectedSpecialty(specialty.name);
                }}
              >
                <RadioItem
                  name="department"
                  checked={
                    currentFilters.categoryId === specialty.id ||
                    selectedSpecialty === specialty.name
                  }
                  option={{ value: String(selectedSpecialty) }}
                  interactive={false}
                  onChange={() => {}}
                />
                <p className={`text-sm text-text`}>{specialty.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div className="w-full mt-6">
          <p className="text-text font-semibold text-sm">Search by distance</p>
          <p className="text-xs text-text my-2">Near you</p>

          <Slider
            value={Number(currentFilters.distance || 0)}
            onChange={(val) => handleSetFilters('distance', val)}
            min={0}
            max={200}
          />

          <div
            className="flex gap-2 cursor-pointer items-center mt-7.5"
            onClick={() => setSearchByCountry(!searchByCountry)}
          >
            <RadioItem
              name="department"
              checked={searchByCountry}
              option={{ value: String(searchByCountry) }}
              interactive={false}
              onChange={() => {}}
            />
            <p className="text-text text-sm">Search by country</p>
          </div>

          <p className="text-text font-semibold text-sm mt-7.5">
            Appointment type
          </p>
          <div className="flex items-center gap-5.75 mt-3">
            {careTypes?.map((careType) => (
              <div
                key={careType.id}
                className="flex gap-2 cursor-pointer items-center"
                onClick={() => setAppointmentType(careType.name)}
              >
                <RadioItem
                  name="department"
                  checked={appointmentType === careType.name}
                  option={{ value: String(careType.name) }}
                  interactive={false}
                  onChange={() => {}}
                />
                <p className="text-text text-sm">{careType.name}</p>
              </div>
            ))}
          </div>

          <p className="text-text font-semibold text-sm mt-7.5">
            Where do you want care?
          </p>
          <div className="flex items-center flex-wrap gap-5.75 mt-3">
            {careModes?.map((careMode) => (
              <div
                key={careMode.id}
                className="flex gap-2 cursor-pointer items-center"
                onClick={() => handleSetFilters('type', careMode.name)}
              >
                <RadioItem
                  name="department"
                  checked={currentFilters.type === careMode.name}
                  option={{ value: String(careMode.name) }}
                  interactive={false}
                  onChange={() => {}}
                />
                <p className="text-text text-sm capitalize">
                  {careMode.name?.toLowerCase()} consultation
                </p>
              </div>
            ))}
          </div>

          <p className="text-text font-semibold text-sm mt-7.5">
            Where do you want care?
          </p>
          <div className="flex items-center flex-wrap gap-2 mt-3">
            {[0, 3, 4]?.map((rating) => {
              const isActive = currentFilters.rating === rating;

              return (
                <Button
                  key={rating}
                  variant={isActive ? 'primary' : 'outline'}
                  className={`gap-2 h-7 text-sm  px-5! ${isActive ? '' : 'text-primary border border-primary'}`}
                  onClick={() => {
                    handleSetFilters('rating', rating);
                  }}
                >
                  <StarIcon className="w-4 h-4" />
                  {rating} or above
                </Button>
              );
            })}
          </div>
        </div>
      )}

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

export default DoctorFilter;
