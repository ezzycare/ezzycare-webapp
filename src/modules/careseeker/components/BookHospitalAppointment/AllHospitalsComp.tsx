import { HospitalDiscoveryItem } from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import { HospitalProfileType } from '@/apiQuery/hospital/discovery/getSingleHospital';

import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import type { HospitalFiltersType } from '@/stores/bookAppointmentStore';
import { debounce } from '@/utils/helper';
import { ArrowLeft, Star } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import HospitalCard from './HospitalCard';
import HospitalProfileComp from './HospitalProfileComp';

interface AllHospitalsCompParams {
  isLoading: boolean;
  hospitals: HospitalDiscoveryItem[] | undefined;
  selectedHospital: HospitalProfileType;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  filters: HospitalFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<HospitalFiltersType>>;
  clickedHospital: HospitalDiscoveryItem | null;
  setClickedHospital: React.Dispatch<
    React.SetStateAction<HospitalDiscoveryItem | null>
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  openFilter: () => void;
  goBack: () => void;
}

const AllHospitalsComp = ({
  isLoading,
  hospitals,
  selectedHospital,
  filters,
  setFilters,
  hasNextPage,
  fetchNextPage,
  clickedHospital,
  setClickedHospital,
  action,
  openFilter,
  goBack,
}: AllHospitalsCompParams) => {
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

  const topHospital = useMemo(() => {
    if (!hospitals?.length) return null;

    const eligibleHospitals = hospitals.filter(
      (hospital) => hospital.rating >= 4.5
    );

    if (!eligibleHospitals.length) return null;

    return eligibleHospitals.reduce((best, current) => {
      if (current.rating > best.rating) return current;

      if (current.rating === best.rating) {
        return current;
      }

      return best;
    });
  }, [hospitals]);

  return (
    <div className="flex flex-col -mt-5">
      {!clickedHospital && (
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
              placeholder="Search Hospitals"
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
            <>
              {topHospital && (
                <div className="mt-5">
                  <div className="w-full flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5">
                      <Star size={18} className="text-text" /> Top Hospitals
                    </p>
                    <p className="text-primary text-sm">View all</p>
                  </div>

                  <div>
                    {topHospital && (
                      <div
                        key={topHospital?.id}
                        className="cursor-pointer w-full mt-2.25"
                        onClick={() => {
                          setClickedHospital(topHospital);
                        }}
                      >
                        <HospitalCard
                          key={topHospital.id}
                          hospital={topHospital}
                          showArrow
                          className="shadow-sm rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <p className="flex items-center gap-1.5">
                  <Star size={18} className="text-text" /> Hospitals near you
                </p>

                <div
                  className="mt-4 min-h-[30vh] max-h-[40vh] overflow-y-auto flex flex-col gap-2.25"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--primary) transparent',
                    scrollBehavior: 'smooth',
                  }}
                >
                  {hospitals
                    ?.filter((hospital) => hospital.id !== topHospital?.id)
                    ?.slice(0, 10)
                    ?.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="w-full cursor-pointer"
                        onClick={() => setClickedHospital(hospital)}
                      >
                        <HospitalCard
                          key={hospital.id}
                          hospital={hospital}
                          showArrow
                          className="shadow-md rounded-xl"
                        />
                      </div>
                    ))}
                </div>
              </div>
              {hasNextPage && (
                <div className="flex items-center justify-center mt-4">
                  <button
                    className="text-primary text-sm"
                    onClick={() => fetchNextPage()}
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {isLoading && (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <SpiralLoader />
        </div>
      )}

      {clickedHospital && selectedHospital && !isLoading && (
        <HospitalProfileComp
          hospital={selectedHospital}
          bookAppointment={() => action()}
        />
      )}
    </div>
  );
};

export default AllHospitalsComp;
