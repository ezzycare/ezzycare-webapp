import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { HospitalDiscoveryItem } from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import { HospitalProfileType } from '@/apiQuery/hospital/discovery/getSingleHospital';

import BounceLoader from '@/components/Base/BounceLoader';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { HospitalFiltersType } from '@/stores/bookAppointmentStore';
import { debounce } from '@/utils/helper';
import { ArrowLeft, LoaderCircle, Star } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import HospitalCard from './HospitalCard';
import HospitalProfileComp from './HospitalProfileComp';

interface AllHospitalsCompParams {
  isLoading: boolean;
  hospitals: HospitalDiscoveryItem[] | undefined;
  firstPageItems: HospitalDiscoveryItem[] | undefined;
  selectedHospital: HospitalProfileType;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  filters: HospitalFiltersType;
  setFilters: React.Dispatch<React.SetStateAction<HospitalFiltersType>>;
  clickedHospital: HospitalDiscoveryItem | null;
  setClickedHospital: React.Dispatch<
    React.SetStateAction<HospitalDiscoveryItem | null>
  >;
  action: (doctor?: Doctor) => void;
  openFilter: () => void;
  goBack: () => void;
}

const AllHospitalsComp = ({
  isLoading,
  hospitals,
  firstPageItems,
  selectedHospital,
  filters,
  setFilters,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
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

  const topHospitals = useMemo(() => {
    if (!hospitals?.length) return null;

    return hospitals.filter((hospital) => hospital.rating >= 4.5);
  }, [hospitals]);

  const topHospitalsFiltered = useMemo(
    () =>
      topHospitals
        ?.filter((hospital) => hospital.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5) ?? [],
    [topHospitals]
  );

  const topHospitalsScrollRef = useRef<HTMLDivElement>(null);
  const { LeftArrow, RightArrow, Indicators } = useHorizontalScroll({
    scrollRef: topHospitalsScrollRef,
    itemCount: topHospitals?.length ?? 0,
  });

  const nearYouItems = useMemo(
    () =>
      hospitals?.filter((hospital) =>
        topHospitalsFiltered.some((h) => h.id === hospital.id)
      ) ?? [],
    [hospitals, topHospitalsFiltered]
  );

  const { accumulatedItems, sentinelRef } = useInfiniteScroll({
    listKey: 'hospitals-near-you',
    items: nearYouItems,
    firstPageItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="flex flex-col -mt-5 relative">
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

          <>
            {!!topHospitals?.length && (
              <div className="mt-5">
                <div className="w-full flex items-center justify-between gap-2">
                  <p className="flex items-center gap-1.5">
                    <Star size={18} className="text-text" /> Top Hospitals
                  </p>
                  <p className="text-primary text-sm">View all</p>
                </div>

                <div className="relative mt-2.25">
                  {LeftArrow}
                  {RightArrow}

                  <div
                    ref={topHospitalsScrollRef}
                    className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar"
                    style={{
                      scrollbarWidth: 'none',
                      scrollBehavior: 'smooth',
                    }}
                  >
                    {topHospitals?.map((hospital) => (
                      <div
                        key={hospital?.id}
                        className="cursor-pointer shrink-0 w-[90%] my-1 snap-center"
                        onClick={() => setClickedHospital(hospital)}
                      >
                        <HospitalCard
                          key={hospital.id}
                          hospital={hospital}
                          showArrow
                          className="shadow-sm rounded-xl h-full"
                        />
                      </div>
                    ))}
                  </div>

                  {Indicators}
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
                {(accumulatedItems as HospitalDiscoveryItem[])?.map(
                  (hospital) => (
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
                  )
                )}

                <div ref={sentinelRef} className="h-px" />

                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <LoaderCircle className="text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </>
        </div>
      )}

      {isLoading && !isFetchingNextPage && <BounceLoader />}

      {clickedHospital && selectedHospital && !isLoading && (
        <HospitalProfileComp
          hospital={selectedHospital}
          bookAppointment={(doctor) => action(doctor)}
        />
      )}
    </div>
  );
};

export default AllHospitalsComp;
