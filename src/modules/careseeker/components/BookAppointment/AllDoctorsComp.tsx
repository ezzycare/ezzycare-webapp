import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import SearchInput from '@/components/Ui/SearchInput';
import type { DoctorFiltersType } from '@/stores/bookAppointmentStore';
import { debounce } from '@/utils/helper';
import { ArrowLeft, Star } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import DoctorCard from '@/modules/hospital/components/Agent/BookAppointment/DoctorCard';
import DoctorProfileComp from './DoctorProfileComp';

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
        search: '',
      }));
    };
  }, []);

  const hasOtherFilters = useMemo(() => {
    return Object.entries(filters)
      .map(([key, value]) => key !== 'search' && value)
      .some(Boolean);
  }, [filters]);

  const topDoctor = useMemo(() => {
    if (!doctors?.length) return null;

    const eligibleDoctors = doctors.filter((doctor) => doctor.rating >= 4.5);

    if (!eligibleDoctors.length) return null;

    return eligibleDoctors.reduce((best, current) => {
      if (current.rating > best.rating) return current;

      if (
        current.rating === best.rating &&
        current.reviewCount > best.reviewCount
      ) {
        return current;
      }

      return best;
    });
  }, [doctors]);

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
            <>
              {topDoctor && (
                <div className="mt-5">
                  <div className="w-full flex items-center justify-between gap-2">
                    <p className="flex items-center gap-1.5">
                      <Star size={18} className="text-text" /> Top Doctors
                    </p>
                    <p className="text-primary text-sm">View all</p>
                  </div>

                  <div>
                    {topDoctor && (
                      <div
                        key={topDoctor?.id}
                        className="cursor-pointer w-full mt-2.25"
                        onClick={() => {
                          setClickedDoctor(topDoctor);
                        }}
                      >
                        <DoctorCard
                          key={topDoctor.id}
                          doctor={topDoctor}
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
                  <Star size={18} className="text-text" /> Doctors near you
                </p>

                <div
                  className="mt-4 min-h-[30vh] max-h-[40vh] overflow-y-auto flex flex-col gap-2.25"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--primary) transparent',
                    scrollBehavior: 'smooth',
                  }}
                >
                  {doctors
                    ?.filter((doctor) => doctor.id !== topDoctor?.id)
                    ?.slice(0, 10)
                    ?.map((doctor) => (
                      <div
                        key={doctor.id}
                        className="w-full cursor-pointer"
                        onClick={() => setClickedDoctor(doctor)}
                      >
                        <DoctorCard
                          key={doctor.id}
                          doctor={doctor}
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
