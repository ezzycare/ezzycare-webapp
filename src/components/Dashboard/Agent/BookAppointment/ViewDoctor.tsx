import Button from '@/components/Ui/Button';
import { CalendarIconLocal } from '@/icons/DashboardNavIcons';
import { formatCurrency } from '@/utils/helper';
import { CircleDollarSign, MapPin } from 'lucide-react';
import DoctorCard from './DoctorCard';
import { SelectDoctorType, StateType } from './type';

const ViewDoctor = ({
  doctor,
  setState,
}: {
  doctor: SelectDoctorType;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  return (
    <div>
      <DoctorCard key={doctor.id} doctor={doctor} />

      <Button
        variant="primary"
        className="mt-4 text-lg! py-4.25! w-full"
        onClick={() => setState('book-appointment')}
      >
        Book Appointment{' '}
      </Button>

      <section className="flex flex-col space-y-3.5 p-3.5">
        <article>
          <p className="text-text-muted text-sm font-medium">
            Years of experience
          </p>
          <p className="text-text text-sm font-medium mt-1">
            {doctor.experience}
          </p>
        </article>

        <div aria-label="divider" className="border-t border-border2"></div>

        <article>
          <p className="text-text-muted text-sm font-medium">About</p>
          <p className="text-text text-sm font-medium mt-1">{doctor.about}</p>
        </article>

        <div aria-label="divider" className="border-t border-border2"></div>

        <article>
          <p className="text-text-muted text-sm font-medium mb-1">
            Time Availability
          </p>
          {doctor.timeAvailability.map((time, index) => (
            <span key={index} className="w-full flex items-center gap-2">
              <CalendarIconLocal className="text-text-muted" />
              <span className="text-text-alt text-sm font-medium">
                {' '}
                {time.day} :
              </span>
              <span className="text-blue-11 text-sm font-medium ml-auto">
                {time.timeStart} - {time.timeEnd}{' '}
              </span>
            </span>
          ))}
        </article>

        <div aria-label="divider" className="border-t border-border2"></div>

        <article>
          <p className="text-text-muted text-sm font-medium mb-1 flex items-center gap-2">
            <CircleDollarSign size={16} />
            <span>Consultation charges</span>
          </p>
          {doctor.consultationCharges &&
            (() => {
              const charge = doctor.consultationCharges;
              const chargeItems = [
                { label: 'Home', value: charge.home },
                { label: 'Video', value: charge.video },
                { label: 'Clinic', value: charge.clinic },
              ];
              // const videoCharge
              return (
                <>
                  {chargeItems.map((item) => (
                    <div
                      key={item.label}
                      className="text-sm flex items-center justify-between gap-5 mt-1"
                    >
                      <p className="text-text">{item.label}:</p>
                      <p className="text-text-muted">
                        {formatCurrency(item.value)}/min (
                        {formatCurrency(item.value * 30)}/30mins)
                      </p>
                    </div>
                  ))}
                </>
              );
            })()}
        </article>

        <div aria-label="divider" className="border-t border-border2"></div>

        <article>
          <p className="text-text-muted text-sm font-medium mb-1 flex items-center gap-2">
            <MapPin size={16} />
            <span>Location</span>
          </p>
          <p>{doctor.location}</p>
        </article>
      </section>
    </div>
  );
};

export default ViewDoctor;
