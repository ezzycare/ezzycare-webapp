import Toggle from '@/components/Base/Toggle';
import Checkbox from '@/components/Ui/Checkbox';
import Dropdown from '@/components/Ui/Dropdown';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { TeamMemberType } from '@/types/team';
import React from 'react';

const EditTeamMemberModal = ({
  openModal,
  setOpenModal,
  data,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: TeamMemberType;
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
        title="Edit Team Member"
        description="View and manage team member"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col mt-5">
          <div className="flex flex-col gap-4 text-xs">
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Name</p>
              <p className="text-text-text">{data.name}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Email</p>
              <p className="text-text-text">{data.email}</p>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <p className="text-text-muted">Status</p>
              <p>
                <Toggle
                  label={data.status === 'active' ? 'Active' : 'Inactive'}
                  size="sm"
                  value={data.status === 'active'}
                  onChange={() => {}}
                />
              </p>
            </div>
          </div>

          <div>
            <Dropdown
              label="Role"
              value={data.role}
              options={[{ label: data.role, value: data.role }]}
              fullWidth
              containerClassName="h-12!"
              disabled
            />
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
              Delete User
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

export default EditTeamMemberModal;
