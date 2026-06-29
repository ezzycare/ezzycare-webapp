import { type Role } from '@/apiQuery/hospital/get/getRoles';
import Checkbox from '@/components/Ui/Checkbox';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import React from 'react';

const RoleDetailsModal = ({
  openModal,
  setOpenModal,
  data,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: Role;
}) => {
  const permissions = [
    'Manage Patients',
    'Manage Doctors',
    'Manage Appointments',
    'Manage Agents',
    'Manage Settings',
    'Access Finance',
    'View Analytics & Dashboard',
    'Initiate Withdrawal',
  ];

  const [selected, setSelected] = React.useState<string[]>([]);

  const handleChange = (value: boolean, permission: string) => {
    if (value) {
      setSelected([...selected, permission]);
    } else {
      setSelected(selected.filter((item) => item !== permission));
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Role Details"
        description="View and manage role details"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col mt-5">
          <div className="flex flex-col gap-4 text-xs">
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Role Name</p>
              <p className="text-text-text font-medium">{data.name}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Created by</p>
              <p className="text-text-text">{data.creatorName}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Creator&apos;s Email</p>
              <p className="text-text-text">{data.creatorEmail}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Date Created</p>
              <p className="text-text-text">{data.createdAt}</p>
            </div>
          </div>

          <p className="text-sm text-text font-medium mb-1">Permissions</p>
          <div className="grid grid-cols-2">
            {permissions.map((permission, index) => (
              <div
                key={index}
                className="flex items-center justify-start gap-2 mb-2"
              >
                <Checkbox
                  onChange={(value) => {
                    handleChange(value, permission);
                  }}
                />
                <p className="text-text-alt text-[10px]">{permission}</p>
              </div>
            ))}
          </div>

          <div className="flex w-full mt-6 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Delete Role
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoleDetailsModal;
