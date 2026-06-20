/* eslint-disable @typescript-eslint/no-explicit-any */
import { Doctor } from '@/apiQuery/doctor/getDoctorDiscovery';
import type { HospitalProfileType } from '@/apiQuery/hospital/discovery/getSingleHospital';
import Tabs from '@/components/Base/Tabs';
import { MapFilledLocal } from '@/icons/DashboardIcons';
import {
  HospitalIconLocal,
  StethoscopeIconLocal,
} from '@/icons/DashboardNavIcons';
import { useBookAppointmentStore } from '@/stores/bookAppointmentStore';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import DoctorsList from '../BookAppointment/DoctorsList';

const HospitalProfileComp = ({
  hospital,
  bookAppointment,
}: {
  hospital: HospitalProfileType;
  bookAppointment: () => void;
}) => {
  const tabs = ['Doctors', 'About', 'Contact'];
  const [activeTab, setActiveTab] = useState(0);
  const [clickedDoctor, setClickedDoctor] = useState<null | any>(null);

  const { updateBooking } = useBookAppointmentStore();

  useEffect(() => {
    if (clickedDoctor) {
      updateBooking({ clickedDoctor, isHospitalAppointment: true });
      setTimeout(() => {
        bookAppointment();
      }, 300);
    }
  }, [clickedDoctor]);

  const doctors = useMemo(() => {
    return (hospital?.doctors ?? []) as unknown as Doctor[];
  }, [hospital?.doctors]);

  const hospitalAddress = `${hospital?.contact?.address}, ${hospital?.contact?.city}, ${hospital?.contact?.country}`;

  return (
    <div className="">
      <div className="py-5 px-6">
        <Image
          src={
            hospital?.profileImage ||
            'https://cdn-icons-png.flaticon.com/512/4320/4320371.png'
          }
          width={350}
          height={141}
          alt={hospital?.hospitalName}
          className="max-h-35.25 w-full object-cover object-top"
        />
        <div className="grid grid-cols-[1fr_100px] gap-2 mt-3">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <HospitalIconLocal className="text-text-muted" />
              {hospital?.hospitalName}
            </p>
            <p className="flex items-center gap-1  text-xs text-text-muted">
              <MapFilledLocal size={15} className="text-text-muted" />{' '}
              {hospitalAddress}
            </p>
          </div>
          <p className="flex items-center gap-1 text-xs text-warning bg-warning-3a rounded-full py-1 px-2 h-fit">
            <Star size={14} /> {(hospital?.rating || 0).toFixed(1)} Ratings
          </p>
        </div>
      </div>

      <Tabs tabItems={tabs} setActiveIndex={setActiveTab} />

      {activeTab === 0 && (
        <div>
          <DoctorsList
            doctors={doctors}
            firstPageItems={doctors}
            hasNextPage={false}
            fetchNextPage={() => {}}
            isFetchingNextPage={false}
            setClickedDoctor={setClickedDoctor}
          />
        </div>
      )}

      {activeTab === 1 && (
        <section className="flex flex-col space-y-3.5 p-3.5">
          <article>
            <p className="text-text-muted text-sm font-medium">Description</p>
            <p className="text-text text-sm font-medium mt-2">
              {hospital?.aboutUs}
            </p>
          </article>

          <div aria-label="divider" className="border-t border-border2"></div>

          <article>
            <p className="text-text-muted text-sm font-medium">
              Services offered
            </p>
            <p className="flex items-center gap-2 mt-2">
              {hospital?.services?.map((service: any, index: number) => (
                <span
                  key={index}
                  className="bg-gray-3a text-text text-[10px] px-2 py-0.5 rounded-sm"
                >
                  {service.name}
                </span>
              ))}
            </p>
          </article>

          <div aria-label="divider" className="border-t border-border2"></div>

          <article>
            <p className="text-text-muted text-sm font-medium mb-2">
              Time Availability
            </p>
            {hospital?.timeAvailability.map((time: any, index: number) => (
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
            <p className="text-text-muted text-sm font-medium">
              Available Doctors
            </p>
            <p className="text-text text-sm font-medium mt-2 flex items-center gap-2">
              <StethoscopeIconLocal />{' '}
              <span>Doctors: {hospital?.totalDoctors}</span>
            </p>
          </article>
        </section>
      )}

      {activeTab === 2 && (
        <section className="flex flex-col space-y-3.5 p-3.5">
          <article className="space-y-3">
            <p className="text-text text-sm font-medium">
              <span>Contact</span>
            </p>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <p className="text-sm text-text">Phone:</p>
              <p className="text-sm text-text-muted">
                {hospital?.contact?.mobileNo}
              </p>
            </div>
            <div className="grid grid-cols-[80px_1fr] items-center gap-3">
              <p className="text-sm text-text">Email:</p>
              <p className="text-sm text-text-muted">
                {hospital?.contact?.email}
              </p>
            </div>
          </article>
        </section>
      )}
    </div>
  );
};

export default HospitalProfileComp;
