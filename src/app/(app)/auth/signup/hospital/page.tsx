/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useSignUpMutation } from '@/apiQuery/auth/signup';
import AddressAutocomplete, {
  type PlaceDetails,
} from '@/components/Ui/AddressAutocomplete';
import Button from '@/components/Ui/Button';
import Card from '@/components/Ui/Card';
import {
  PasswordInput,
  PhoneInput,
  TextInput,
} from '@/components/Ui/TextInput';
import { HospitalIconLocal, UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const HospitalRegistrationSchema = z.object({
  hospitalName: z.string().min(1, 'Hospital name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  location: z.string().min(1, 'Location is required'),
  adminName: z.string().min(1, 'Admin name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
type HospitalRegistration = z.infer<typeof HospitalRegistrationSchema>;

const RegisterHospital = () => {
  const router = useRouter();

  const { updateSignupDetails } = useAuthStore((state: AuthStore) => state);

  const { mutateAsync, isPending } = useSignUpMutation();

  const [place, setPlace] = useState<PlaceDetails | null>(null);

  const handlePlaceSelect = useCallback((placeData: PlaceDetails) => {
    setPlace(placeData);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(HospitalRegistrationSchema),
  });

  const onSubmit = async (data: HospitalRegistration) => {
    const payload = {
      firstName: data.adminName?.split(' ')[0] || '',
      lastName: data.adminName?.split(' ')[1] || '',
      hospitalName: data.hospitalName,
      email: data.email,
      mobileNo: data.phone || undefined,
      password: data.password,
      location: data.location,
      latitude: place?.latitude ?? undefined,
      longitude: place?.longitude ?? undefined,
      state: place?.state || undefined,
      country: place?.country || undefined,
      accountType: 'HOSPITAL' as const,
    };
    try {
      const res = await mutateAsync(payload);

      toaster.success(res.message || 'Verification code sent');
      updateSignupDetails(payload);
      router.push(`/auth/verify-email?type=signup&email=${data.email}`);
    } catch (error: any) {
      toaster.error(
        (error?.response?.data?.message ?? error?.message) ||
          'Registration failed, please try again'
      );
    }
  };

  return (
    <Card onCancel={() => router.back()}>
      <div className="flex flex-col">
        <h1 className="font-medium text-text text-2xl">
          Hospital Registration
        </h1>
        <p className="text-text-alt text-sm mt-1.5">
          Provide your information to registered as a hospital
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 mt-5 flex flex-col"
        >
          <TextInput
            label="Hospital Name"
            placeholder="Hospital name"
            leftIcon={<HospitalIconLocal className="text-text-muted" />}
            {...register('hospitalName')}
            error={errors.hospitalName?.message}
          />
          <TextInput
            label="Hospital Email"
            placeholder="Email"
            leftIcon={<EnvelopeClosedIcon className="text-text-muted" />}
            {...register('email')}
            error={errors.email?.message}
          />
          <PhoneInput
            label="Phone"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <AddressAutocomplete
            control={control}
            name="location"
            label="Location"
            placeholder="Hospital address"
            leftIcon={<MapPinIcon size={18} className="text-text-muted" />}
            error={errors.location?.message}
            onPlaceSelect={handlePlaceSelect}
          />
          <TextInput
            label="Admin Name"
            placeholder="Admin name"
            leftIcon={<UserIconLocal className="text-text-muted" />}
            {...register('adminName')}
            error={errors.adminName?.message}
          />
          <PasswordInput
            label="Password"
            {...register('password')}
            error={errors.password?.message}
          />
          <Button
            type="submit"
            className="w-full mt-10 h-12 flex justify-center"
            variant="primary"
            loading={isPending}
            disabled={!isValid || isPending}
          >
            Continue
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default RegisterHospital;
