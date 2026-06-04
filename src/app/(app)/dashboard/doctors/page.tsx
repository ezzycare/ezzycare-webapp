/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import CreateDoctorModal from '@/components/Dashboard/Doctor/CreateDoctorModal';
// import { redirect } from 'next/navigation';
import Pagination from '@/components/Base/Pagination';
import DoctorsTable from '@/components/Dashboard/Doctor/DoctorsTable';
import InviteDoctorModal from '@/components/Dashboard/Doctor/InviteDoctorModal';
import IconBase from '@/components/Dashboard/IconBase';
import { Button } from '@/components/Ui/Button';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { DoctorType } from '@/types/doctors';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';

const Doctors = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);

  const totals = [
    {
      title: 'Total Doctors',
      value: '2500',
      icon: <UserIconLocal className="text-blue-10" />,
    },
    {
      title: 'Total unassigned',
      value: '1000',
      icon: <UserIconLocal className="text-pink-11" />,
    },
    {
      title: 'Total Assigned to hospital',
      value: '100',
      icon: <UserIconLocal className="text-error-10" />,
    },
  ];

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'active';
    if (rand < 0.8) return 'pending';
    return 'suspended';
  };

  const getSpecialty = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.2) return 'dentistry';
    if (rand < 0.6) return 'cardiology';
    return 'neurology';
  };

  const getHospital = (): string | undefined => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.2) return 'emory hospital';
    if (rand < 0.6) return undefined;
    return 'emory hospital 3';
  };

  const registrations: DoctorType[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medical.com',
    phoneNumber: '+1 (555) 123-4567',
    assignedHospital: getHospital(),
    experience: (i + 1) * 2 - i + ' years',
    specialty: getSpecialty(),
    createdAt: '2023-01-01',
    status: getStatus(),
    address: 'Highlevel, Makurdi, Benue State',
    medicalCertificate: 'MD',
    practiceLicense: '12345',
    specialtyCertificate: '12345',
    licenseExpiryDate: '12 May 2035',
    qualifications: ['MD', 'FAAP'],
    university: 'University of California, San Francisco',
    dateGraduated: '12 May 2015',
    about: `Dr. Rodriguez is passionate about child health and development.`,
  }));

  const meta = {
    page: 1,
    pageSize: 10,
    pageCount: Math.round(registrations.length / 10),
    total: registrations.length,
  };
  const paginatedData = (): DoctorType[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;
    return registrations.slice(startIndex, endIndex);
  };

  const filters = [
    {
      label: 'Specialty',
      key: 'specialty',
      options: [
        {
          label: 'Dentistry',
          value: 'dentistry',
        },
        {
          label: 'Cardiology',
          value: 'cardiology',
        },
        {
          label: 'Neurology',
          value: 'neurology',
        },
      ],
      fn: (row: DoctorType, value: any) =>
        row.specialty === value?.toLowerCase(),
    },
    {
      label: 'Status',
      key: 'status',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Suspended',
          value: 'suspended',
        },
      ],
      fn: (row: DoctorType, value: any) => row.status === value,
    },
  ];

  return (
    <div className="p-7.5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-text text-2xl font-medium">Doctor Management</h3>
          <p className="text-sm text-text-muted ">
            View doctor profiles and manage hospital assignments
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => setCreateModal(true)}
            className="bg-blue-11a! hover:bg-blue-11a/80"
            variant="primary"
          >
            Create New Doctor
          </Button>
          <Button
            className="flex items-center flex-row!"
            variant="outline"
            onClick={() => setOpenInviteModal(true)}
          >
            <Plus size={18} className="mr-2" />
            Invite Doctor
          </Button>
          <Button
            className="flex items-center bg-blue-11a!"
            variant="primary"
            onClick={() => setCreateModal(true)}
          >
            <UserIconLocal className="mr-2" />
            Add Doctor
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
      <div className="mt-4 rounded-xl bg-surface-card pb-5">
        <DoctorsTable
          data={paginatedData()}
          searchable={true}
          searchPlaceholder="Search by name, email, specialization, or qualification..."
          searchContainerClassName="max-w-[404px]!"
          filters={filters}
        ></DoctorsTable>

        {meta && meta?.pageCount > 1 && (
          <div className="mt-auto pt-10">
            <Pagination
              pages={meta.pageCount}
              page={currentPage}
              setPage={setCurrentPage}
            />
          </div>
        )}

        <CreateDoctorModal
          openModal={createModal}
          setOpenModal={setCreateModal}
        ></CreateDoctorModal>
        <InviteDoctorModal
          openModal={openInviteModal}
          setOpenModal={setOpenInviteModal}
        ></InviteDoctorModal>
      </div>
    </div>
  );
};

export default Doctors;
