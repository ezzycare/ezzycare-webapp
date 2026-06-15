import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import Modal from '@/components/Ui/Modal';
import SearchInput from '@/components/Ui/SearchInput';
import { ArrowLeft, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DoctorCard from './DoctorCard';
import { doctors } from './sampleDoctors';
import { StateType } from './type';
import ViewDoctor from './ViewDoctor';

const SelectDoctor = ({
  openModal,
  setOpenModal,
  setState,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  const [searchText, setSearchText] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [clickedDoctor, setClickedDoctor] = useState<DoctorProfile | null>(
    null
  );

  const [selectedDoctors, setSelectedDoctors] = useState(doctors);

  useEffect(() => {
    // setSelectedDoctors(
    //   doctors
    //     .filter((doctor: DoctorProfile) => {
    //       if (searchText) {
    //         return (
    //           doctor.firstName
    //             .toLowerCase()
    //             .includes(searchText.toLowerCase()) ||
    //           doctor.specialization
    //             .toLowerCase()
    //             .includes(searchText.toLowerCase())
    //         );
    //       }
    //       return true;
    //     })
    //     .filter((doctor) => {
    //       if (activeFilters.length > 0) {
    //         return activeFilters.includes(doctor.specialization);
    //       }
    //       return true;
    //     })
    // );
  }, [searchText, activeFilters]);

  const handleClose = () => {
    if (clickedDoctor) {
      return setClickedDoctor(null);
    }

    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      size="md"
      showCloseButton
      persistent
    >
      <div className="flex flex-col">
        {!clickedDoctor && (
          <div className="flex flex-col">
            <span className="w-10 h-10 bg-gray-3 rounded-full flex items-center justify-center">
              <ArrowLeft size={18} className="text-text-alt" />
            </span>

            <div className="mt-4">
              <SearchInput
                placeholder="Search Doctors"
                onChange={(e) => setSearchText(e.target.value)}
                filters={[
                  {
                    key: 'specialization',
                    label: 'Specialty',
                  },
                ]}
                onFilterChange={(filter) => {
                  setActiveFilters((prev) =>
                    prev.includes(filter.key)
                      ? prev.filter((f) => f !== filter.key)
                      : [...prev, filter.key]
                  );
                }}
              />
            </div>

            <div className="mt-8">
              <div className="w-full flex items-center justify-between gap-2">
                <p className="flex items-center gap-1.5">
                  <Star size={18} className="text-text" /> Top Doctors
                </p>
                <p className="text-primary text-sm">View all</p>
              </div>

              <div>
                {doctors?.slice(0, 1)?.map((doctor: DoctorProfile) => (
                  <div
                    key={doctor.id}
                    className="cursor-pointer w-full"
                    onClick={() => setClickedDoctor(doctor)}
                  >
                    <DoctorCard key={doctor.id} doctor={doctor} showArrow />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="w-full flex items-center justify-between gap-2">
                <p className="text-text font-semibold">Doctors near you</p>
              </div>

              <div
                className="mt-4 max-h-[50vh] overflow-y-auto flex flex-col"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--primary) transparent',
                  scrollBehavior: 'smooth',
                }}
              >
                {doctors?.slice(0, 10)?.map((doctor: DoctorProfile) => (
                  <div
                    key={doctor.id}
                    className="w-full cursor-pointer"
                    onClick={() => setClickedDoctor(doctor)}
                  >
                    <DoctorCard key={doctor.id} doctor={doctor} showArrow />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {clickedDoctor && (
          <ViewDoctor doctor={clickedDoctor} setState={setState} />
        )}
      </div>
    </Modal>
  );
};

export default SelectDoctor;
