import { HospitalDiscoveryItem } from '@/apiQuery/hospital/discovery/getHospitalDiscovery';
import { HospitalProfileType } from '@/apiQuery/hospital/discovery/getSingleHospital';
import { MapFilledLocal } from '@/icons/DashboardIcons';
import { ArrowRight, CircleCheck, Edit, Star } from 'lucide-react';
import Image from 'next/image';

const HospitalCard = ({
  hospital,
  showArrow = false,
  className = '',
}: {
  hospital: HospitalDiscoveryItem | HospitalProfileType;
  showArrow?: boolean;
  className?: string;
}) => {
  const hospitalAddress =
    'contact' in hospital
      ? `${hospital.contact?.address}, ${hospital.contact?.city}, ${hospital.contact?.state}, ${hospital.contact?.country}`
      : `${hospital.address}, ${hospital.city}, ${hospital.state}, ${hospital.country}`;

  return (
    <div
      className={`p-3.5 bg-surface-card flex items-center gap-3 ${className}`}
    >
      <Image
        // hospital avatar
        src={'https://cdn-icons-png.flaticon.com/512/4320/4320371.png'}
        alt={hospital?.hospitalName}
        width={90}
        height={73}
        className="rounded-xl object-cover"
      />
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex w-full justify-between items-center">
          <p className="flex items-center gap-2 text-sm font-medium">
            {hospital?.hospitalName}{' '}
            {hospital?.rating > 0 && (
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
            <MapFilledLocal size={15} className="text-text-muted" />{' '}
            {hospitalAddress}
          </p>
        </div>

        <div className="flex w-full gap-1 items-center mt-3 text-xs">
          <p className="flex items-center gap-1 text-warning bg-warning-3a rounded-full py-0.5 px-2">
            <Star size={14} /> {(hospital?.rating || 0).toFixed(1)} Ratings
          </p>
          <p className="flex items-center gap-1 text-info bg-info-3a rounded-full py-0.5 px-2">
            <Edit size={14} /> {hospital?.totalDoctors} Reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
