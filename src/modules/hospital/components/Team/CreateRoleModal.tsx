import { useGetHospitalPermissions } from '@/apiQuery/hospital/get/getPermissions';
import { useCreateHospitalRoleMutation } from '@/apiQuery/hospital/post/createRoles';
import Button from '@/components/Ui/Button';
import Checkbox from '@/components/Ui/Checkbox';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import React, { useState } from 'react';

const CreateRoleModal = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { permissions } = useGetHospitalPermissions();

  const { mutateAsync: createRole, isPending } =
    useCreateHospitalRoleMutation();

  const [roleName, setRoleName] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (value: boolean, permissionKey: string) => {
    if (value) {
      setSelected([...selected, permissionKey]);
    } else {
      setSelected(selected.filter((item) => item !== permissionKey));
    }
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toaster.error('Role name is required');

      return;
    }

    try {
      await createRole({
        name: roleName,
        permissions: selected,
      });

      toaster.success('Role created successfully');
      setRoleName('');
      setSelected([]);
      setOpenModal(false);
    } catch (e: unknown) {
      const err = e as { message?: string };
      toaster.error(err?.message || 'Failed to create role');
    }
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Create New Role"
        description="Define a new role with specific permissions for your team members"
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col mt-5">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
            <TextInput
              label="Role Name"
              placeholder="E.g. Operations Manager"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="h-12!"
            />
            <Dropdown
              label="Color"
              options={[
                { label: 'Blue', value: 'blue' },
                { label: 'Amber', value: 'amber' },
                { label: 'Green', value: 'green' },
              ]}
              fullWidth
              containerClassName="h-12!"
            />
          </div>

          <div className="mt-3">
            <TextInput
              label="Description"
              placeholder="Describe the responsibility"
              className="h-12!"
            />
          </div>

          <p className="text-sm text-text font-medium mb-1">Permissions</p>
          <div className="grid grid-cols-2">
            {permissions &&
              permissions?.map((permission, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start gap-2 mb-2"
                >
                  <Checkbox
                    onChange={(value) => {
                      handleChange(value, permission.key);
                    }}
                  />
                  <p className="text-text-alt text-[10px]">
                    {permission.label}
                  </p>
                </div>
              ))}
          </div>

          <div className="flex w-full mt-6">
            <Button
              variant="primary"
              className="w-full"
              loading={isPending}
              disabled={isPending}
              onClick={handleSubmit}
            >
              Create Role
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateRoleModal;
