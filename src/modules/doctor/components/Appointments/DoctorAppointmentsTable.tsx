/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  DoctorAppointment,
  DoctorAppointmentClient,
} from '@/apiQuery/doctor/appointments/types';
import { useCancelAppointmentMutation } from '@/apiQuery/healthcareAppointments/patch/cancelAppointment';
import BaseTable from '@/components/Base/Table';
import { ChatIconLocal } from '@/icons/DashboardIcons';
import { toaster } from '@/lib/toaster';
import CancelBookingModal from '@/modules/careseeker/components/Appointments/CancelBookingModal';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { BaseTableProps, Column } from '@/types/table';
import { statusColor, StatusType } from '@/utils/helper';
import { EyeOpenIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CareSeekerAppointmentsTable = ({
  data,
  columns,
  searchable,
  ...props
}: Partial<BaseTableProps<DoctorAppointment>> & {
  data: DoctorAppointment[];
  searchable?: boolean;
  columns?: Column<DoctorAppointment>[];
}) => {
  const { push } = useRouter();
  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );
  const [currentRow, setCurrentRow] = useState<DoctorAppointment | null>(null);
  const [openCancelBookingModal, setOpenCancelBookingModal] =
    useState<boolean>(false);

  const { mutate: cancelAppointment, isPending } =
    useCancelAppointmentMutation();

  const handleCancelAppointment = (reason: string) => {
    if (!currentRow?.id) return;
    cancelAppointment(
      {
        id: Number(currentRow.id!),
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
      field: 'client',
      label: 'Patient Name',
      sortable: false,
      render: (value: DoctorAppointmentClient) => (
        <span>{`${value.firstName} ${value.lastName}`}</span>
      ),
    },

    {
      field: 'appointmentType',
      label: 'Consultation type',
      sortable: false,
      render: (value: string) => {
        return <span className="capitalize">{value?.toLowerCase()}</span>;
      },
    },
    {
      field: 'appointmentDate',
      label: 'Appointment Date',
      sortable: false,
      render: (value: string, row: DoctorAppointment) => {
        return (
          <span>{`${dayjs(value).format('MMM DD, YYYY')} ${row.appointmentTime}`}</span>
        );
      },
    },
    {
      field: 'status',
      label: 'Status',
      render: (value: string) => (
        <div
          className={`inline-flex rounded-full px-3 py-1 text-xs capitalize font-medium ${statusColor(
            value?.toLowerCase() as StatusType
          )}`}
        >
          {value?.toLowerCase()?.replace('_', ' ')}
        </div>
      ),
    },
    {
      field: 'actions',
      label: 'Actions',

      render: (_: any, row: DoctorAppointment) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'COMPLETED' ? (
            <button
              className={`inline-flex gap-2 rounded-md px-1.5 py-1 hover:bg-gray-3a/50
                text-xs font-medium border border-text-alt cursor-pointer`}
              onClick={() =>
                push(
                  `/dashboard/messages?peerId=${row.clientId}&peerName=${encodeURIComponent(
                    row.client?.firstName
                      ? `${row.client.firstName} ${row.client.lastName}`
                      : ''
                  )}`
                )
              }
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
      <BaseTable<DoctorAppointment>
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
