/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Pagination from '@/components/Base/Pagination';
import CreateHospitalModal from '@/components/Dashboard/Hospital/CreateHospitalModal';
import HospitalsTable from '@/components/Dashboard/Hospital/HospitalsTable';
import { Button } from '@/components/Ui/Button';
import { HospitalType } from '@/types/hospitals';
import { useState } from 'react';

const Hospital = () => {
  const [createModal, setCreateModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);

  const getStatus = (): string => {
    // eslint-disable-next-line react-hooks/purity
    const rand = Math.random();

    if (rand < 0.5) return 'active';
    if (rand < 0.8) return 'pending';
    return 'suspended';
  };

  const hospitals: HospitalType[] = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: 'Emory hospital',
    email: 'emory hospital@gmail.com',
    phoneNumber: '08169192646',
    address: 'Highlevel, Makurdi, Benue State',
    status: getStatus(),
  }));

  const meta = {
    page: 1,
    pageSize: 10,
    pageCount: Math.round(hospitals.length / 10),
    total: hospitals.length,
  };
  const paginatedData = (): HospitalType[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;
    return hospitals.slice(startIndex, endIndex);
  };

  const filter = {
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
    fn: (row: HospitalType, value: any) => row.status === value,
  };

  return (
    <div className="m-5 bg-surface-card rounded-2xl p-8">
      <HospitalsTable
        data={paginatedData()}
        searchable={true}
        filterLabel="Status"
        filters={[filter]}
        titleComponent={
          <div className="">
            <h3 className="text-text text-2xl font-medium">Hospitals</h3>
            <p className="text-sm text-text-muted whitespace-nowrap ">
              View and manage hospital records
            </p>
          </div>
        }
      >
        <Button
          className="h-9! text-xs font-semibold"
          color="#007E9B"
          onClick={() => setCreateModal(true)}
        >
          Create New Hospital
        </Button>
      </HospitalsTable>

      <div className="mt-auto pt-10">
        <Pagination
          pages={meta.pageCount}
          page={currentPage}
          setPage={setCurrentPage}
        />
      </div>

      <CreateHospitalModal
        openModal={createModal}
        setOpenModal={setCreateModal}
      ></CreateHospitalModal>
    </div>
  );
};

export default Hospital;
