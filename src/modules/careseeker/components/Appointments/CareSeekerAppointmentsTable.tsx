/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useCancelAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import BaseTable from '@/components/Base/Table';
import StatusText from '@/components/Ui/StatusText';
import { ChatIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { CareSeekerAppointmentType } from '@/types/appointments';
import { BaseTableProps, Column } from '@/types/table';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CancelBookingModal from './CancelBookingModal';

const CareSeekerAppointmentsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<CareSeekerAppointmentType>> & {
  data: CareSeekerAppointmentType[];
  searchable?: boolean;
  columns?: Column<CareSeekerAppointmentType>[];
}) => {
  const { push } = useRouter();
  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );
  const [currentRow, setCurrentRow] =
    useState<CareSeekerAppointmentType | null>(null);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    useState<boolean>(false);

  const { mutate: cancelAppointment, isPending } =
    useCancelAppointmentMutation();

  const handleCancelAppointment = (reason: string) => {
    if (!currentRow?.id) return;
    cancelAppointment(
      {
        id: currentRow.id!,
        reason,
      },
      {
        onSuccess: () => {
          setOpenCancelBookingModal(false);
          toaster.success('Appointment cancelled successfully');
        },
      }
    );
  };

  const localColumns = [
    {
      field: 'user',
      label: 'Doctor',
      sortable: false,
      render: (value: DoctorProfile) => (
        <span>{`Dr. ${value.firstName} ${value.lastName}`}</span>
      ),
    },

    {
      field: 'age',
      label: 'Specialty',
      sortable: false,
      render: (_: any, row: CareSeekerAppointmentType) => {
        return (
          <span>
            {
              categories.find((c) =>
                [c.id, c.parentId].includes(row.user?.categoryId || '')
              )?.name
            }
          </span>
        );
      },
    },
    {
      field: 'appointmentDate',
      label: 'Appointment Date',
      sortable: false,
      render: (value: string) => {
        return <span>{dayjs(value).format('MMM DD, YYYY HH:mm A')}</span>;
      },
    },
    {
      field: 'uid',
      label: 'Location',
      sortable: false,
      render: (_: any, row: CareSeekerAppointmentType) => {
        return <span>{row?.user?.userDetails?.address}</span>;
      },
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => <StatusText value={value} />,
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (_: any, row: CareSeekerAppointmentType) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'COMPLETED' ? (
            <button
              className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-text-alt cursor-pointer`}
              onClick={() => {
                push(
                  `/dashboard/messages?peerId=${row.userId}&peerName=${encodeURIComponent(
                    row.client?.firstName
                      ? `${row.client.firstName} ${row.client.lastName}`
                      : ''
                  )}`
                );
              }}
            >
              <ChatIconLocal />
              Chat
            </button>
          ) : (
            row.status?.toLowerCase() !== 'cancelled' && (
              <button
                className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-text-alt cursor-pointer`}
                onClick={() => {
                  setCurrentRow(row);
                  setOpenCancelBookingModal(true);
                }}
              >
                Cancel
              </button>
            )
          )}
          <button
            className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:opacity-80
                text-xs text-surface-card bg-blue-11 font-medium border border-border2 cursor-pointer`}
            onClick={() => {
              push(`/dashboard/appointments/${row.id}`);
            }}
          >
            <EyeOpenIcon />
            <span>View details</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <BaseTable<CareSeekerAppointmentType>
        data={data}
        searchable={searchable || false}
        columns={columns || localColumns}
        {...props}
      >
        {props?.children}
      </BaseTable>
      {currentRow?.id && (
        <CancelBookingModal
          openModal={openCancelBookingModal}
          setOpenModal={setOpenCancelBookingModal}
          isLoading={isPending}
          action={handleCancelAppointment}
        />
      )}
    </div>
  );
};

export default CareSeekerAppointmentsTable;
