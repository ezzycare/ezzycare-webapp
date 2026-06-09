import type {
  Availability,
  DoctorProfile,
} from '@/apiQuery/doctor/getSingleDoctor';
import Tabs from '@/components/Base/Tabs';
import Button from '@/components/Ui/Button';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { formatCurrency } from '@/utils/helper';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useState } from 'react';
import DoctorCard from '../../Agent/BookAppointment/DoctorCard';

const DoctorProfileComp = ({
  doctor,
  setState,
  bookAppointment,
}: {
  doctor: DoctorProfile;
  setState: () => void;
  bookAppointment: () => void;
}) => {
  const tabs = ['About', 'Certifications'];
  const [activeTab, setActiveTab] = useState(0);

  const doctorAddress = `${doctor?.userDetails?.address}, ${doctor?.userDetails?.city}, ${doctor?.userDetails?.country}`;

  return (
    <div className="">
      <div
        className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
        onClick={setState}
      >
        <ArrowLeft size={20} />
        <p className="text-sm font-medium">Back</p>
      </div>
      <h3 className="text-text text-base mb-2.25">Doctor details</h3>
      <DoctorCard
        key={doctor?.id}
        doctor={doctor}
        className="shadow-sm rounded-xl"
      />

      <Button
        variant="primary"
        className="my-3 text-base w-full h-11"
        onClick={bookAppointment}
      >
        Book Appointment{' '}
      </Button>

      <Tabs tabItems={tabs} setActiveIndex={setActiveTab} />

      {activeTab === 0 && (
        <section className="flex flex-col space-y-3.5 p-3.5">
          <article>
            <p className="text-text-muted text-sm font-medium">About</p>
            <p className="text-text text-sm font-medium mt-2">
              {doctor?.userDetails?.aboutUs}
            </p>
          </article>

          <div aria-label="divider" className="border-t border-border2"></div>

          <article>
            <p className="text-text-muted text-sm font-medium mb-2">
              Time Availability
            </p>
            {doctor?.availability.map((time: Availability, index: number) => (
              <span key={index} className="w-full flex items-center gap-2">
                <span className="text-text-alt text-sm font-medium">
                  {' '}
                  {time.day} :
                </span>
                <span className="text-blue-11 text-sm font-medium ml-auto">
                  {time.slots[0]?.startTime} - {time.slots[0]?.endTime}{' '}
                </span>
              </span>
            ))}
          </article>

          <div aria-label="divider" className="border-t border-border2"></div>

          <article>
            <p className="text-text-muted text-sm font-medium mb-2 flex items-center gap-2">
              <span>Consultation charges</span>
            </p>
            {(() => {
              const chargeItems = [
                {
                  label: 'Home',
                  value: doctor?.userDetails?.homeConsultationCharge,
                },
                {
                  label: 'Video',
                  value: doctor?.userDetails?.videoConsultationCharge,
                },
                {
                  label: 'Clinic',
                  value: doctor?.userDetails?.clinicConsultationCharge,
                },
              ];

              return (
                <>
                  {chargeItems
                    ?.filter((charge) => charge.value !== null)
                    .map((item) => (
                      <div
                        key={item.label}
                        className="text-sm flex items-center justify-between gap-5 mt-1"
                      >
                        <p className="text-text">{item.label}:</p>
                        {item?.value && (
                          <p className="text-text-muted">
                            {formatCurrency(item.value)}/min (
                            {formatCurrency(item.value * 30)}/30mins)
                          </p>
                        )}
                      </div>
                    ))}
                </>
              );
            })()}
          </article>
        </section>
      )}

      {activeTab === 1 && (
        <section className="flex flex-col space-y-3.5 p-3.5">
          <article className="space-y-3">
            <p className="text-text-muted text-sm font-medium flex items-center gap-2">
              <MapPin size={16} />
              <span>Location</span>
            </p>
            <p className="text-sm text-text">{doctorAddress}</p>
          </article>

          <div aria-label="divider" className="border-t border-border2"></div>

          <article className="space-y-3">
            <p className="text-text-muted text-sm font-medium flex items-center gap-2">
              <UserIconLocal size={16} />
              <span>Experience</span>
            </p>
            <p className="text-sm text-text">
              {doctor?.userDetails?.totalExperienceYear}
            </p>
          </article>
        </section>
      )}
    </div>
  );
};

export default DoctorProfileComp;
