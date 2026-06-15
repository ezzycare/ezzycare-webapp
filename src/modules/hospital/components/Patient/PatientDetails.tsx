'use client';

import Button from '@/components/Ui/Button';
import StatusText from '@/components/Ui/StatusText';
import { CalendarIconLocal, UserIconLocal } from '@/icons/DashboardNavIcons';
import { PatientType } from '@/types/patients';
import { ArrowLeft, Edit, HeartIcon, Phone } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import EditPatientModal from './EditPatientModal';

const PatientDetails = ({ patient }: { patient: PatientType }) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  return (
    <div>
      <Link
        href="/dashboard/patients"
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-text-alt" />
        <p className="text-sm text-text-alt">Back to Patients</p>
      </Link>

      <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-text text-2xl font-medium">{patient.name}</h3>
            <StatusText value={patient.status} />
          </div>

          <div className="flex items-center gap-2.5 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-text-alt">Patient ID: A001</p>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-auto gap-2">
          <Button
            variant="outline"
            className="bg-blue-3a text-primary hover:bg-blue-3a/50 border-none py-2! px-4! gap-2"
            onClick={() => setOpenEditModal(true)}
          >
            Edit Details
            <Edit size={18} className="text-primary" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4 sm:mt-8 items-start">
        <div className="rounded-xl border border-gray-5 p-5 h-full">
          <div className="flex items-center gap-1.5">
            <UserIconLocal className="text-text-alt " />
            <h3 className="text-text text-lg font-medium">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-center justify-between pb-8">
            <div>
              <h3 className="text-text font-medium">Name</h3>
              <p className="text-sm text-text-muted mt-2.5">{patient.name}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Email</h3>
              <p className="text-sm text-text-muted mt-2.5">{patient.email}</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Date of birth</h3>
              <p className="text-sm text-text-muted mt-2.5">March 15, 1985</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Gender</h3>
              <p className="text-sm text-text-muted mt-2.5">Male</p>
            </div>
            <div>
              <h3 className="text-text font-medium">BloodType</h3>
              <p className="text-sm text-text-muted mt-2.5">A+</p>
            </div>
            <div>
              <h3 className="text-text font-medium">Address</h3>
              <p className="text-sm text-text-muted mt-2.5 max-w-34.5">
                123 Main St, Anytown, USA
              </p>
            </div>
          </div>
        </div>

        {/* CONTACT AND EMERGENCY */}
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-gray-5 p-5">
            <div className="flex items-center gap-1.5">
              <Phone size={20} className="text-text-alt " />
              <h3 className="text-text text-lg font-medium">
                Emergency Contact
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-center justify-between pb-8">
              <div>
                <h3 className="text-text font-medium">Name</h3>
                <p className="text-sm text-text-muted mt-2.5">Jane Smith</p>
              </div>
              <div>
                <h3 className="text-text font-medium">Phone</h3>
                <p className="text-sm text-text-muted mt-2.5">
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-5 p-5">
            <div className="flex items-center gap-1.5">
              <Phone size={20} className="text-text-alt " />
              <h3 className="text-text text-lg font-medium">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-center justify-between pb-8">
              <div>
                <h3 className="text-text font-medium">Phone</h3>
                <p className="text-sm text-text-muted mt-2.5">
                  {patient.phoneNumber}
                </p>
              </div>
              <div>
                <h3 className="text-text font-medium">Email</h3>
                <p className="text-sm text-text-muted mt-2.5">
                  {patient.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-5 p-5">
          <div className="flex items-center gap-1.5">
            <HeartIcon size={20} className="text-text-alt" />
            <h3 className="text-text text-lg font-medium">Medical History</h3>
          </div>

          <div className="flex flex-col gap-3.5 mt-3 pb-5 pl-6">
            <div>
              <h3 className="text-text font-medium">Medical History</h3>
              <p className="text-sm text-text-muted mt-1">
                Hypertension diagnosed in 2020. Regular check-ups recommended.
              </p>
            </div>
            <div>
              <h3 className="text-text font-medium">Allergies</h3>
              <div className="flex items-center gap-2 mt-2">
                <StatusText value={'suspended'} text="Penicillin" />
                <StatusText value={'suspended'} text="Peanuts" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-5 p-5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-text text-lg font-medium">
              Account Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-center justify-between pb-8">
            <div>
              <h3 className="text-text text-sm font-medium">Date registered</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarIconLocal className="text-text-muted " />
                <p className="text-text-muted">Friday, May 06, 2026</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Last visit</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <CalendarIconLocal className="text-text-muted " />
                <p className="text-text-muted">{patient.lastVisit}</p>
              </div>
            </div>
            <div>
              <h3 className="text-text text-sm font-medium">Total bookings</h3>
              <p className="text-text-muted">{patient.bookings}</p>
            </div>
          </div>
        </div>
      </div>

      <EditPatientModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
    </div>
  );
};

export default PatientDetails;
