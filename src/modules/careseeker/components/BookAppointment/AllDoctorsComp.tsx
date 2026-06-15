import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import type { DoctorFiltersType } from '@/stores/bookAppointmentStore';
import { debounce } from '@/utils/helper';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DoctorProfileComp from './DoctorProfileComp';
import DoctorsList from './DoctorsList';

interface AllDoctorsCompParams {
  isLoading: boolean;
  doctors: Doctor[] | undefined;
  selectedDoctor: DoctorProfile;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  filters: DoctorFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<DoctorFiltersType>>;
  clickedDoctor: Doctor | null;
  setClickedDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  openFilter: () => void;
  goBack: () => void;
}

const AllDoctorsComp = ({
  isLoading,
  doctors,
  selectedDoctor,
  filters,
  setFilters,
  hasNextPage,
  fetchNextPage,
  clickedDoctor,
  setClickedDoctor,
  action,
  openFilter,
  goBack,
}: AllDoctorsCompParams) => {
  const [searchText, setSearchText] = useState('');

  const debouncedSetFilters = useRef(
    debounce((value: string) => {
      setFilters((prev) => ({
        ...prev,
        search: value,
      }));
    }, 500)
  ).current;

  const handleSearch = (value: string) => {
    setSearchText(value);
    debouncedSetFilters(value);
  };

  useEffect(() => {
    return () => {
      setFilters((prev) => ({
        ...prev,
        search: undefined,
      }));
    };
  }, []);

  const hasOtherFilters = useMemo(() => {
    return Object.entries(filters)
      .map(([key, value]) => key !== 'search' && value)
      .some(Boolean);
  }, [filters]);

  return (
    <div className="flex flex-col -mt-5">
      {!clickedDoctor && (
        <div className="flex flex-col">
          <div
            className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
            onClick={goBack}
          >
            <ArrowLeft size={20} />
            <p className="text-sm font-medium">Back</p>
          </div>

          <div className="mt-4 flex flex-col w-full">
            <SearchInput
              value={searchText}
              placeholder="Search Doctors"
              onChange={(e) => handleSearch(e.target.value)}
              onOpenFilter={() => openFilter()}
              onClear={() => handleSearch('')}
              containerClassName="rounded-full!"
            />
            {hasOtherFilters && (
              <Button
                variant="outline"
                className="h-6 text-xs px-2! mt-1 ml-auto"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {!isLoading && (
            <DoctorsList
              doctors={doctors}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              setClickedDoctor={setClickedDoctor}
            />
          )}
        </div>
      )}

      {isLoading && (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <SpiralLoader />
        </div>
      )}

      {clickedDoctor && selectedDoctor && !isLoading && (
        <DoctorProfileComp
          doctor={selectedDoctor}
          setState={() => setClickedDoctor(null)}
          bookAppointment={() => action()}
        />
      )}
    </div>
  );
};

export default AllDoctorsComp;
