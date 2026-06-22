/* eslint-disable react-hooks/set-state-in-effect */
import { User } from '@/apiQuery/auth/types';
import {
  Gender,
  useUpdateProfileMutation,
} from '@/apiQuery/users/updateProfile';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';

const genders: Gender[] = ['MALE', 'FEMALE'];
const CompleteDoctorProfileModal = ({
  openModal,
  setOpenModal,
  data,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: User;
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGender, setSelectedGender] = useState<Gender>('MALE');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const { mutateAsync: update, isPending } = useUpdateProfileMutation();

  useEffect(() => {
    setFullName(`${data?.firstName ?? ''} ${data?.lastName ?? ''}`.trim());
    setPhone(data?.mobileNo ?? '');
    setSelectedGender((data?.gender as Gender) || 'MALE');

    if (data?.userDetails?.dob) {
      const d = dayjs(data.userDetails.dob);
      if (d.isValid()) {
        setDobDay(d.format('DD'));
        setDobMonth(d.format('MM'));
        setDobYear(d.format('YYYY'));
      }
    }
  }, [data]);
  const handleSubmit = async () => {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const day = dobDay.padStart(2, '0');
    const month = dobMonth.padStart(2, '0');
    const year = dobYear || '';
    const dob = day && month && year ? `${year}-${month}-${day}` : undefined;

    await update({
      firstName,
      lastName,
      mobileNo: phone,
      gender: selectedGender,
      dob,
    });

    toaster.success('Profile updated!');
    setOpenModal(false);
  };

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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="E.g Emmanuel Smith"
              label="Full Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
            />
            <PhoneInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=""
              label="Phone"
            />
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
                <TextInput
                  value={dobDay}
                  onChange={(e) => setDobDay(e.target.value)}
                  placeholder="DD"
                  className=""
                  maxLength={2}
                />
                <TextInput
                  value={dobMonth}
                  onChange={(e) => setDobMonth(e.target.value)}
                  placeholder="MM"
                  className=""
                  maxLength={2}
                />
                <TextInput
                  value={dobYear}
                  onChange={(e) => setDobYear(e.target.value)}
                  placeholder="YYYY"
                  className=""
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full mt-6">
            <Button
              variant="primary"
              className="w-full"
              loading={isPending}
              onClick={handleSubmit}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompleteDoctorProfileModal;
