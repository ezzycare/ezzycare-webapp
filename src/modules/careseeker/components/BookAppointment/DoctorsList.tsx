import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import DoctorCard from '@/modules/hospital/components/Agent/BookAppointment/DoctorCard';
import { Star } from 'lucide-react';
import { useMemo } from 'react';

interface DoctorsListProps {
  doctors: Doctor[] | undefined;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  setClickedDoctor: React.Dispatch<React.SetStateAction<Doctor | null>>;
}

const DoctorsList = ({
  doctors,
  hasNextPage,
  fetchNextPage,
  setClickedDoctor,
}: DoctorsListProps) => {
  console.log({ doctors });
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
  );
};

export default DoctorsList;
