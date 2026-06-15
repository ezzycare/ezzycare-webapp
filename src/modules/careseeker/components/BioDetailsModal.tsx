/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import React, { useState } from 'react';

const genders = ['male', 'female'];
const BioDetailsModal = ({
  openModal,
  setOpenModal,
  data,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}) => {
  const [selectedGender, setSelectedGender] = useState('');
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Bio details"
        description="Add your details to get more personalized experience on EzzyCare."
        size="md"
      >
        <div className="space-y-4 flex w-full flex-col">
          <div className="space-y-2 mt-5 flex flex-col">
            <TextInput
              placeholder="E.g Emmanuel Smith"
              label="Full Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
            />
            <PhoneInput placeholder="" label="Phone" />
            <div>
              <p className="text-sm text-text font-medium mb-1">Gender</p>
              <div>
                <div className="w-full flex items-center space-x-4">
                  {genders?.map((gender) => (
                    <div
                      key={gender}
                      className="w-1/2 flex items-center space-x-3 cursor-pointer py-3.5 px-3.5 border border-border2 rounded-xl"
                      onClick={() => setSelectedGender(gender)}
                    >
                      <RadioItem
                        name="department"
                        checked={selectedGender === gender}
                        option={{ value: gender }}
                        interactive={false}
                        onChange={() => {}}
                      />
                      <label htmlFor="female" className="capitalize">
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-text font-medium mb-1">
                Date of birth
              </p>
              <div className="flex items-center gap-1.5">
                <TextInput placeholder="DD -" className="" />
                <TextInput placeholder="MM -" className="" />
                <TextInput placeholder="YY -" className="" />
              </div>
            </div>
          </div>

          <div className="flex w-full mt-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                toaster.success('Profile updated!');
                setOpenModal(false);
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BioDetailsModal;
