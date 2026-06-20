import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import DoctorCard from '@/modules/hospital/components/Agent/BookAppointment/DoctorCard';
import { LoaderCircle, Star } from 'lucide-react';
import { useMemo, useRef } from 'react';

interface DoctorsListProps {
  doctors: Doctor[] | undefined;
  firstPageItems: Doctor[] | undefined;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  setClickedDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>;
}

const DoctorsList = ({
  doctors,
  firstPageItems,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  setClickedDoctor,
}: DoctorsListProps) => {
  const topDoctors = useMemo(
    () =>
      doctors
        ?.filter((doctor) => doctor.rating >= 4.5)
        .sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating;
          }

          return b.reviewCount - a.reviewCount;
        })
        .slice(0, 5) ?? [],
    [doctors]
  );

  const nearYouItems = useMemo(() => {
    const topDoctorIds = new Set(topDoctors.map((doctor) => doctor.id));

    return doctors?.filter((doctor) => !topDoctorIds.has(doctor.id)) ?? [];
  }, [doctors, topDoctors]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { LeftArrow, RightArrow, Indicators } = useHorizontalScroll({
    scrollRef,
    itemCount: topDoctors?.length ?? 0,
  });

  const { accumulatedItems, sentinelRef } = useInfiniteScroll({
    listKey: 'doctors-near-you',
    items: nearYouItems,
    firstPageItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <>
      {!!topDoctors?.length && (
        <div className="mt-5">
          <div className="w-full flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5">
              <Star size={18} className="text-text" /> Top Doctors
            </p>
            <p className="text-primary text-sm">View all</p>
          </div>

          <div className="relative mt-2.25">
            {LeftArrow}
            {RightArrow}

            <div
              ref={scrollRef}
              className="flex overflow-x-auto snap-x snap-mandatory gap-3 no-scrollbar"
              style={{
                scrollbarWidth: 'none',
                scrollBehavior: 'smooth',
              }}
            >
              {topDoctors?.map((doctor) => (
                <div
                  key={doctor?.id}
                  className="cursor-pointer shrink-0 w-[90%] my-1 snap-center"
                  onClick={() => setClickedDoctor(doctor)}
                >
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
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
          {(accumulatedItems as Doctor[])?.map((doctor) => (
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

          <div ref={sentinelRef} className="h-px" />

          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <LoaderCircle className="text-primary animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
