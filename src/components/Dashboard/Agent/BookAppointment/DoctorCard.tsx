import { MapFilledLocal } from '@/icons/DashboardIcons';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { ArrowRight, CircleCheck, Edit, Star } from 'lucide-react';
import Image from 'next/image';
import { SelectDoctorType } from './type';

const DoctorCard = ({
  doctor,
  showArrow = false,
}: {
  doctor: SelectDoctorType;
  showArrow?: boolean;
}) => {
  return (
    <div className="p-3.5 bg-surface-card flex items-center gap-3">
      <Image
        src={'https://i.pravatar.cc/150?u=1'}
        alt={doctor.name}
        width={90}
        height={73}
        className="rounded-xl object-cover"
      />
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex w-full justify-between items-center">
          <p className="flex items-center gap-2 text-sm font-medium">
            {doctor.name}{' '}
            {doctor.verified && (
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
            <UserIconLocal className="text-text-alt" /> {doctor.specialization}
          </p>
          <p className="flex items-center gap-1">
            <MapFilledLocal className="text-text-alt" /> {doctor.location}
          </p>
        </div>

        <div className="flex w-full gap-1 items-center mt-3 text-xs">
          <p className="flex items-center gap-1 text-primary bg-accent-3a rounded-full py-0.5 px-2">
            <Star size={16} /> {doctor.rating} Ratings
          </p>
          <p className="flex items-center gap-1 text-plum-11a bg-pink-3a rounded-full py-0.5 px-2">
            <Edit size={16} /> {doctor.totalReviews} Reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
