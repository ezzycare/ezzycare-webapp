/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { useUpdateDoctorProfileMutation } from '@/apiQuery/doctor/profile/updateProfile';
import Button from '@/components/Ui/Button';
import DatePicker from '@/components/Ui/DatePicker';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

interface CompleteDoctorProfileModalProps {
  openModal: boolean;
  setOpenModal: () => void;
  data: DoctorProfile;
}

const formatCalendarDate = (date: CalendarDate | null): string | undefined => {
  if (!date) return undefined;
  return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
};

const stringToCalendarDate = (
  dateStr: string | null | undefined
): CalendarDate | null => {
  if (!dateStr) return null;
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new CalendarDate(y, m, d);
};

const profileSchema = z.object({
  university: z.string().min(1, 'University is required'),
  yearGraduated: z
    .any()
    .refine(
      (v: CalendarDate | null) => v !== null,
      'Year graduated is required'
    ),
  specialty: z.string().optional(),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  address: z.string().min(1, 'Address is required'),
  licenseExpiry: z
    .any()
    .refine(
      (v: CalendarDate | null) => v !== null,
      'License expiry is required'
    ),
});

type ProfileForm = z.infer<typeof profileSchema>;

const CompleteDoctorProfileModal = ({
  openModal,
  setOpenModal,
  data,
}: CompleteDoctorProfileModalProps) => {
  const { mutate: update, isPending } = useUpdateDoctorProfileMutation();

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      university: '',
      yearsOfExperience: '',
      address: '',
      specialty: '',
      yearGraduated: null,
      licenseExpiry: null,
    },
  });

  useEffect(() => {
    if (!data) return;
    const details = data?.userDetails;

    reset({
      university:
        data.education && data.education?.length
          ? data.education[0]?.collegeName
          : '',
      yearsOfExperience: details?.totalExperienceYear
        ? String(details.totalExperienceYear)
        : '',
      address: details?.address ?? '',
      specialty: data?.subcategoryId ?? '',
      yearGraduated:
        data.education && data.education?.length
          ? stringToCalendarDate(data.education[0]?.endYear)
          : '',
      licenseExpiry: stringToCalendarDate(details?.practicingLicenceDate),
    });
  }, [data, reset]);

  const specialtyOptions = useMemo(() => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  }, [categories]);

  const onSubmit = (formData: ProfileForm) => {
    update(
      {
        education: {
          collegeName: formData.university,
          endYear: formatCalendarDate(formData.yearGraduated) ?? '',
        } as any,
        yearsOfExperience: formData.yearsOfExperience,
        address: formData.address,
        practicingLicenceDate: formatCalendarDate(formData.licenseExpiry),
        subcategoryId: formData.specialty
          ? Number(formData.specialty)
          : undefined,
      },
      {
        onSuccess: () => {
          toaster.success('Profile updated!');
          setOpenModal();
        },
        onError: () => {
          toaster.error('Failed to update profile');
        },
      }
    );
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal()}
      title="Complete your profile"
      description="This helps you get verified on EzzyCare"
      size="md"
      persistent
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mt-2"
      >
        <TextInput
          label="University Attended"
          placeholder="Enter university name"
          className="h-10!"
          {...register('university')}
          error={errors.university}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">
            Year graduated
          </label>
          <Controller
            control={control}
            name="yearGraduated"
            render={({ field }) => (
              <DatePicker
                aria-label="Year graduated"
                value={field.value}
                onChange={field.onChange}
                maxValue={today(getLocalTimeZone())}
                fullWidth
                iconPlacement="right"
                buttonClassName="h-10! bg-surface-card border border-border2"
              />
            )}
          />
          {errors.yearGraduated && (
            <span className="text-sm text-error">
              {errors.yearGraduated.message as string}
            </span>
          )}
        </div>

        <Controller
          control={control}
          name="specialty"
          render={({ field }) => (
            <Dropdown
              label="Specialty (Optional)"
              placeholder="Select specialty"
              options={specialtyOptions}
              value={field.value}
              containerClassName="h-10!"
              onChange={field.onChange}
              fullWidth
            />
          )}
        />

        <TextInput
          label="Years of experience"
          placeholder="E.g 5"
          type="number"
          className="h-10!"
          {...register('yearsOfExperience')}
          error={errors.yearsOfExperience}
        />

        <TextInput
          label="Address"
          placeholder="Enter address"
          className="h-10!"
          {...register('address')}
          error={errors.address}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text">
            Practice license expiry date
          </label>
          <Controller
            control={control}
            name="licenseExpiry"
            render={({ field }) => (
              <DatePicker
                aria-label="Practice license expiry date"
                value={field.value}
                onChange={field.onChange}
                minValue={today(getLocalTimeZone())}
                fullWidth
                iconPlacement="right"
                buttonClassName="h-10! bg-surface-card border border-border2"
              />
            )}
          />
          {errors.licenseExpiry && (
            <span className="text-sm text-error">
              {errors.licenseExpiry.message as string}
            </span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 mt-6 rounded-full"
          loading={isPending}
        >
          Continue
        </Button>
      </form>
    </Modal>
  );
};

export default CompleteDoctorProfileModal;
