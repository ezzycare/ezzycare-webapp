import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { MapFilledLocal } from '@/icons/DashboardIcons';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { ArrowRight, CircleCheck, Edit, Star } from 'lucide-react';
import Image from 'next/image';

const DoctorCard = ({
  doctor,
  showArrow = false,
  className = '',
}: {
  doctor: Doctor | DoctorProfile;
  showArrow?: boolean;
  className?: string;
}) => {
  const doctorName = `${doctor?.firstName} ${doctor?.lastName}`;
  const doctorAddress = `${doctor?.userDetails?.address}, ${doctor?.userDetails?.city}, ${doctor?.userDetails?.country}`;
  const specializations = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );

  const doctorSpecialization = specializations.find(
    (item) => item.id === doctor?.subcategoryId
  );

  return (
    <div
      className={`p-3.5 bg-surface-card flex items-center gap-3 ${className}`}
    >
      <Image
        src={'https://i.pravatar.cc/150?u=1'}
        alt={doctorName}
        width={90}
        height={73}
        className="rounded-xl object-cover"
      />
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex w-full justify-between items-center">
          <p className="flex items-center gap-2 text-sm font-medium">
            {doctorName}{' '}
            {doctor?.emailVerifiedAt && (
              <CircleCheck
                size={18}
                className="text-success fill-success stroke-white"
              />
            )}
          </p>

          {showArrow && <ArrowRight size={16} className="text-text-alt" />}
        </div>

        <div className="flex w-full gap-3 items-center text-xs">
          <p className="flex items-center gap-1">
            <UserIconLocal className="text-text-muted" />{' '}
            {doctorSpecialization?.name}
          </p>
          <p className="flex items-center gap-1">
            <MapFilledLocal className="text-text-muted" />{' '}
            {doctor?.userDetails?.city}
          </p>
        </div>

        <div className="flex w-full gap-1 items-center mt-3 text-xs">
          <p className="flex items-center gap-1 text-blue-11 bg-accent-3a rounded-full py-0.5 px-2">
            <Star size={14} /> {(doctor?.rating || 0).toFixed(1)} Ratings
          </p>
          <p className="flex items-center gap-1 text-plum-11a bg-pink-3a rounded-full py-0.5 px-2">
            <Edit size={14} /> {doctor?.reviewCount} Reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
