'use client';

// import { redirect } from 'next/navigation';
import IconBase from '@/components/Dashboard/IconBase';
import Button from '@/components/Ui/Button';
import { NotificationDarkIconLocal } from '@/icons/DashboardNavIcons';
import PeopleIconLocal from '@/icons/PeopleIcon';
import { BookingType } from '@/types/bookings';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import AppointmentsTable from './AppointmentsTable';
import BookAppointment from './BookAppointment';

const AgentAdminDashboard = () => {
  const [openBookingModal, setOpenBookingModal] = useState<boolean>(false);

  const totals = [
    {
      title: 'Total Patients Registered',
      value: '100',
      icon: <PeopleIconLocal className="text-blue-10a" />,
    },
    {
      title: 'Completed Appointments',
      value: '50',
      icon: <PeopleIconLocal className="text-green-10" />,
    },
    {
      title: 'Upcoming Appointments',
      value: '12',
      icon: <NotificationDarkIconLocal className="text-crimson-11" />,
    },
  ];

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'active';
    if (rand < 0.8) return 'pending';
    return 'suspended';
  };

  const bookings: BookingType[] = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    bookingId: 'B001',
    patientName: 'John Smith',
    doctor: {
      id: i + 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medical.com',
      phoneNumber: '+1 (555) 123-4567',
      assignedHospital: 'Emory',
      experience: (i + 1) * 2 - i + ' years',
      specialty: 'Cardiology',
      createdAt: 'May 08, 2026 10:00 AM',
      status: 'active',
      address: 'Highlevel, Makurdi, Benue State',
      medicalCertificate: 'MD',
      practiceLicense: '12345',
      specialtyCertificate: '12345',
      licenseExpiryDate: '12 May 2035',
      qualifications: ['MD', 'FAAP'],
      university: 'University of California, San Francisco',
      dateGraduated: '12 May 2015',
      about: `Dr. Rodriguez is passionate about child health and development.`,
    },
    hospital: {
      name: 'Emory hospital',
    },
    appointmentDate: '08069192646',
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: getStatus(),
  }));

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-muted text-[28px] font-medium">
            Good Morning, <span className="text-text">Micheal</span>
          </h1>
          <p className="text-text-muted">
            Here&apos;s what is happening on the platform today...
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            className="flex items-center flex-row!"
            variant="primary"
            onClick={() => setOpenBookingModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 justify-between items-center">
        {totals.map((item) => (
          <div
            key={item.title}
            className="flex gap-4 items-center justify-left p-5 bg-surface-card rounded-lg"
          >
            <IconBase>{item.icon}</IconBase>
            <div className="flex flex-col gap-2">
              <h2 className="text-xs text-muted font-semibold font-500 uppercase">
                {item.title}
              </h2>
              <p className="text-text font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-surface-card">
        <div className="w-full flex items-center justify-between px-6 pt-5">
          <h2 className="text-text font-semibold">Upcoming appointments</h2>
          <Link href="/dashboard/bookings">
            <p className="text-primary text-sm font-medium cursor-pointer">
              View all
            </p>
          </Link>
        </div>
        <AppointmentsTable data={bookings} />

        <BookAppointment
          openModal={openBookingModal}
          setOpenModal={setOpenBookingModal}
        ></BookAppointment>
      </div>
    </div>
  );
};

export default AgentAdminDashboard;
