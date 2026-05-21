'use client';

import { Button } from '@/components/Ui/Button';
import FancyButton from '@/components/Ui/FancyButton';
import { DepartmentIconLocal } from '@/icons/DashboardIcons';
import { FolderIconLocal } from '@/icons/FolderIconLocal';
import { DoctorType } from '@/types/doctors';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { ArrowLeft, Briefcase, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import AssignToDeptModal from './AssignToDeptModal';
import EditDoctorModal from './EditDoctorModal';

const DoctorDetails = ({ doctor }: { doctor: DoctorType }) => {
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openAssignModal, setOpenAssignModal] = React.useState(false);
  return (
    <div>
      <Link
        href="/dashboard/doctors"
        className="flex items-center gap-2 cursor-pointer"
      >
        <ArrowLeft className="text-text-alt" />
        <p className="text-sm text-text-alt">Back to Doctors</p>
      </Link>

      <div className="mt-8 flex items-start gap-4 flex-wrap justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h3 className="text-text text-2xl font-medium">{doctor.name}</h3>
            <p className="text-xs text-blue-11a py-1.5 px-2.5 bg-blue-3a rounded-lg">
              {doctor.specialty}
            </p>
          </div>

          <div className="flex items-center gap-2.5 mt-3 text-sm">
            <div className="flex items-center gap-1.5">
              <GraduationCap size={18} className="text-text-alt" />
              <p className="text-sm text-text-alt">
                {doctor.qualifications?.join(', ')}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase size={18} className="text-text-alt" />
              <p className="text-sm text-text-alt">
                {doctor.experience + ' experience'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center ml-auto gap-3">
          <FancyButton
            variant="outline"
            className="text-text! hover:text-surface-card!"
            onClick={() => setOpenEditModal(true)}
          >
            Edit Details
          </FancyButton>
          <FancyButton
            variant="outline"
            className="text-text! hover:text-surface-card!"
          >
            Verify Doctor
          </FancyButton>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-8 items-start">
        <div className="flex flex-col gap-y-3">
          <Department doctor={doctor} setOpenAssignModal={setOpenAssignModal} />
          <AboutDoctor doctor={doctor} />
        </div>
        <div className="flex flex-col gap-y-3">
          <ProfessionalDetails doctor={doctor} />
          <ContactInfo doctor={doctor} />
        </div>
      </div>
      <EditDoctorModal
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
      />
      <AssignToDeptModal
        openModal={openAssignModal}
        setOpenModal={setOpenAssignModal}
      />
    </div>
  );
};

export default DoctorDetails;

const ViewFileButton = () => {
  return (
    <div className="flex items-center gap-1.5 mt-2.5">
      <FolderIconLocal />
      <FancyButton
        variant="outline"
        className="py-1! px-2.5! text-text! hover:text-surface-card!"
      >
        View File
      </FancyButton>
    </div>
  );
};

const Department = ({
  doctor,
  setOpenAssignModal,
}: {
  doctor: DoctorType;
  setOpenAssignModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="rounded-xl border border-gray-5 p-5">
      <div>
        <div className="flex items-center gap-1.5">
          <DepartmentIconLocal className="text-text-muted " />
          <h3 className="text-text text-lg font-medium">Department</h3>
        </div>
        <p className="text-sm text-text-muted mt-2.5">
          Assign this doctor to a department to make them available for
          appointments
        </p>
      </div>

      <Button
        className="mt-5 gap-3 w-full bg-blue-11a!"
        onClick={() => setOpenAssignModal(true)}
      >
        <DepartmentIconLocal />
        Assign to Department
      </Button>
    </div>
  );
};

const AboutDoctor = ({ doctor }: { doctor: DoctorType }) => {
  return (
    <div className="rounded-xl border border-gray-5 p-5">
      <div>
        <h3 className="text-text font-medium">About</h3>
        <p className="text-sm text-text-muted mt-2.5">{doctor.about}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 items-center justify-between">
        <div>
          <h3 className="text-text font-medium">University Attended</h3>
          <p className="text-sm text-text-muted mt-2.5">{doctor.university}</p>
        </div>
        <div>
          <h3 className="text-text font-medium">Date Graduated</h3>
          <p className="text-sm text-text-muted mt-2.5">
            {doctor.dateGraduated}
          </p>
        </div>
        <div>
          <h3 className="text-text font-medium">Address</h3>
          <p className="text-sm text-text-muted mt-2.5">{doctor.address}</p>
        </div>
      </div>
    </div>
  );
};

const ProfessionalDetails = ({ doctor }: { doctor: DoctorType }) => {
  return (
    <div className="rounded-xl border border-gray-5 p-5 h-full">
      <div className="flex items-center gap-1.5">
        <GraduationCap className="text-text-alt " />
        <h3 className="text-text text-lg font-medium">Professional details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[194px_194px] gap-5 mt-5 items-center justify-left">
        <div>
          <h3 className="text-sm text-text font-medium">Medical certificate</h3>
          <ViewFileButton />
        </div>
        <div>
          <h3 className="text-sm text-text font-medium">
            Current practice license
          </h3>
          <ViewFileButton />
        </div>
        <div>
          <h3 className="text-sm text-text font-medium">
            Specialty certificate
          </h3>
          <ViewFileButton />
        </div>
        <div>
          <h3 className="text-sm text-text font-medium">License expiry</h3>
          <p className="text-sm text-text-muted mt-2.5">
            {doctor.licenseExpiryDate}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ doctor }: { doctor: DoctorType }) => {
  return (
    <div className="rounded-xl border border-gray-5 p-5 h-full sm:h-40.25">
      <div className="flex items-center gap-1.5">
        <EnvelopeClosedIcon className="text-text-alt" />
        <h3 className="text-text text-lg font-medium">Contact Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[194px_194px] gap-5 mt-5 items-center justify-left">
        <div>
          <h3 className="text-sm text-text font-medium">Email</h3>
          <p className="text-sm text-text-muted mt-2.5">{doctor.email}</p>
        </div>
        <div>
          <h3 className="text-sm text-text font-medium">Phone</h3>
          <p className="text-sm text-text-muted mt-2.5">{doctor.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};
