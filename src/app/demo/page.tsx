'use client';

import ThemeToggle from '@/components/Base/ThemeToogle';
import { Button } from '@/components/Ui/Button';
import Checkbox from '@/components/Ui/Checkbox';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import RadioGroup from '@/components/Ui/RadioGroup';
import BaseTable from '@/components/Ui/Table';
import {
  PasswordInput,
  PhoneInput,
  TextInput,
} from '@/components/Ui/TextInput';
import { useState } from 'react';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
};

const users: User[] = [
  {
    id: 1,
    name: 'Blessing Alfred',
    email: 'blealf@gmail.com',
    role: 'Frontend Engineer',
    status: 'active',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@gmail.com',
    role: 'Designer',
    status: 'inactive',
  },
];

const Page = () => {
  const [selectedRadio, setSelectedRadio] = useState<string>('');
  const [dropdownValue, setDropdownValue] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-full gap-2">
      <div className="flex items-center gap-3">
        <h3 className="text-text">Button: </h3>

        <div className="flex items-center gap-3">
          <Button>Button</Button>
          <Button variant="secondary">Button</Button>
          <Button variant="outline">Button</Button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Table: </h3>

        <div className="flex items-center gap-3">
          <div className="p-8">
            <BaseTable<User>
              data={users}
              searchable
              filters={[
                {
                  label: 'Active',
                  value: 'active',
                  fn: (row) => row.status === 'active',
                },
                {
                  label: 'Inactive',
                  value: 'inactive',
                  fn: (row) => row.status === 'inactive',
                },
              ]}
              columns={[
                {
                  field: 'name',
                  label: 'User',
                  sortable: true,
                  width: '1.5fr',

                  render: (_, row) => (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 font-bold">
                        {row.name[0]}
                      </div>

                      <div>
                        <p className="font-medium">{row.name}</p>

                        <p className="text-xs text-zinc-500">#{row.id}</p>
                      </div>
                    </div>
                  ),
                },

                {
                  field: 'email',
                  label: 'Email',
                  sortable: true,
                },

                {
                  field: 'role',
                  label: 'Role',
                },

                {
                  field: 'status',
                  label: 'Status',

                  render: (value: string) => (
                    <div
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                        value === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {value}
                    </div>
                  ),
                },
              ]}
            >
              <button className="h-11 rounded-xl bg-white px-4 text-sm font-medium text-black">
                Add User
              </button>
            </BaseTable>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Theme toggle: </h3>

        {/* <ThemeToggle /> */}
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Text Input</h3>

        <div className="flex flex-col items-center gap-3">
          <TextInput placeholder="Enter email" label="Email" />
          <PasswordInput placeholder="Enter password" label="Password" />
          <PhoneInput placeholder="Enter phone number" label="Phone Number" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">CheckBox and Radio</h3>

        <div className="flex flex-col items-center gap-3">
          <Checkbox label="Checkbox" description="Checkbox description" />
          <RadioGroup
            label="Radio Button"
            name="radio"
            options={[
              {
                value: 'option1',
                label: 'Option 1',
                description: 'Option 1 description',
              },
              {
                value: 'option2',
                label: 'Option 2',
                description: 'Option 2 description',
              },
            ]}
            value={selectedRadio}
            onChange={(value) => setSelectedRadio(value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Dropdown</h3>

        <div className="flex flex-col items-center gap-3">
          <Dropdown
            label="Frameworks"
            placeholder="Choose frameworks"
            multiple
            searchable
            value={dropdownValue}
            onChange={(v) => setDropdownValue(v as string[])}
            options={[
              {
                value: 'next',
                label: 'Next.js',
                description: 'React framework',
              },
              {
                value: 'nuxt',
                label: 'Nuxt',
                description: 'Vue framework',
              },
              {
                value: 'sveltekit',
                label: 'SvelteKit',
                description: 'Svelte framework',
              },
            ]}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <h3 className="text-text">Modal</h3>

        <div className="flex flex-col items-center gap-3">
          <>
            <button
              onClick={() => setOpenModal(true)}
              className="
                px-5 py-3
                rounded-xl
                bg-primary
                text-background
                text-xs uppercase tracking-wide
              "
            >
              Open Modal
            </button>

            <Modal
              open={openModal}
              onClose={() => setOpenModal(false)}
              title="Create Project"
              description="Configure your new workspace and settings."
              size="lg"
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-3a p-4">
                  Modal content goes here.
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setOpenModal(false)}
                    className="
                      px-4 py-2
                      rounded-xl
                      border border-neutral-3a
                      text-xs uppercase tracking-wide
                    "
                  >
                    Cancel
                  </button>

                  <button
                    className="
                      px-4 py-2
                      rounded-xl
                      bg-primary
                      text-background
                      text-xs uppercase tracking-wide
                    "
                  >
                    Continue
                  </button>
                </div>
              </div>
            </Modal>
          </>
        </div>
      </div>
    </div>
  );
};

export default Page;
