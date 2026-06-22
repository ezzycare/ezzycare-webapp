/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { User } from '@/apiQuery/auth/types';
import { useUpdateProfileMutation } from '@/apiQuery/users/updateProfile';
import Button from '@/components/Ui/Button';
import DatePicker from '@/components/Ui/DatePicker';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { useEffect, useMemo, useState } from 'react';

interface CompleteDoctorProfileModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  data: User;
}

const CompleteDoctorProfileModal = ({
  openModal,
  setOpenModal,
  data,
}: CompleteDoctorProfileModalProps) => {
  const [university, setUniversity] = useState('');
  const [yearGraduated, setYearGraduated] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string>('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [address, setAddress] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState<string | null>(null);

  const { mutateAsync: update, isPending } = useUpdateProfileMutation();

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );

  useEffect(() => {
    if (data?.userDetails?.address) setAddress(data.userDetails.address);
    if (data?.userDetails?.totalExperienceYear)
      setYearsOfExperience(String(data.userDetails.totalExperienceYear));
    if (data?.subcategoryId) setSpecialty(data.subcategoryId);
  }, [data]);

  const specialtyOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);
  const handleSubmit = async () => {
    if (
      !university ||
      !yearGraduated ||
      !yearsOfExperience ||
      !address ||
      !licenseExpiry
    ) {
      toaster.error('Please fill all required fields');
      return;
    }

    await update({
      address,
      totalExperienceYear: yearsOfExperience,
      subcategoryId: specialty ? Number(specialty) : undefined,
    });

    toaster.success('Profile updated!');
    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      title="Complete your profile"
      description="This helps you get verified on EzzyCare"
      size="md"
      persistent
    >
      <div className="flex flex-col gap-4 mt-2">
        <TextInput
          label="University Attended"
          placeholder="Enter university name"
          value={university}
          className="h-10!"
          onChange={(e) => setUniversity(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">
            Year graduated
          </label>
          <DatePicker
            aria-label="Year graduated"
            value={dateStringToCalendarDate(yearGraduated)}
            onChange={(dateValue) => setYearGraduated(dateValue)}
            maxValue={today(getLocalTimeZone())}
            fullWidth
            iconPlacement="right"
            buttonClassName="h-10! bg-surface-card border border-border2"
          />
        </div>
        <Dropdown
          label="Specialty (Optional)"
          placeholder="Select specialty"
          options={specialtyOptions}
          value={specialty}
          containerClassName="h-10!"
          onChange={(v) => setSpecialty(v as string)}
          fullWidth
        />

        <TextInput
          label="Years of experience"
          placeholder="E.g 5"
          type="number"
          value={yearsOfExperience}
          className="h-10!"
          onChange={(e) => setYearsOfExperience(e.target.value)}
        />

        <TextInput
          label="Address"
          placeholder="Enter address"
          value={address}
          className="h-10!"
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">
            Practice license expiry date
          </label>
          <DatePicker
            aria-label="Practice license expiry date"
            value={dateStringToCalendarDate(licenseExpiry)}
            onChange={(dateValue) => setLicenseExpiry(dateValue)}
            minValue={today(getLocalTimeZone())}
            fullWidth
            iconPlacement="right"
            buttonClassName="h-10! bg-surface-card border border-border2"
          />
        </div>

        <Button
          variant="primary"
          className="w-full h-12 mt-6 rounded-full"
          loading={isPending}
          onClick={handleSubmit}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};

export default CompleteDoctorProfileModal;

const dateStringToCalendarDate = (
  dateString: string | null
): CalendarDate | null => {
  if (!dateString) return null;

  const [yy, mm, dd] = dateString.split('-').map(Number);

  return new CalendarDate(2000 + yy, mm, dd);
};
