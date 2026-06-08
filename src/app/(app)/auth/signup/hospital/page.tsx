'use client';

import { useSignUpMutation } from '@/apiQuery/auth/signup';
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
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const HospitalRegistrationSchema = z.object({
  hospitalName: z.string().min(1, 'Hospital name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  location: z.string().min(1, 'Location is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});
type HospitalRegistration = z.infer<typeof HospitalRegistrationSchema>;

const RegisterHospital = () => {
  const router = useRouter();

  const { hospitalRegDetails, updateHospitalRegDetails } = useAuthStore(
    (state: AuthStore) => state
  );

  const { mutateAsync, isPending } = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(HospitalRegistrationSchema),
  });

  const onSubmit = async (data: HospitalRegistration) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      hospitalName: data.hospitalName,
      email: data.email,
      mobileNo: data.phone || undefined,
      password: data.password,
      location: data.location,
      accountType: 'HOSPITAL' as const,
    };
    try {
      const res = await mutateAsync(payload);

      toaster.success(res.message || 'Verification code sent');
      updateHospitalRegDetails(payload);
      router.push('/auth/signup/verify-email');
    } catch (error) {
      // toaster.error(error?.message || 'Registration failed');
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
            leftIcon={<HospitalIconLocal className="text-text-muted" />}
            {...register('hospitalName')}
            error={errors.hospitalName?.message}
          />
          <TextInput
            label="Hospital Email"
            leftIcon={<EnvelopeClosedIcon />}
            {...register('email')}
            error={errors.email?.message}
          />
          <PhoneInput
            label="Phone"
            {...register('phone')}
            error={errors.phone?.message}
          />
          <TextInput
            label="Location"
            leftIcon={<MapPinIcon size={18} className="text-text-muted" />}
            {...register('location')}
            error={errors.location?.message}
          />
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label="First Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
              {...register('firstName')}
              error={errors.firstName?.message}
            />
            <TextInput
              label="Last Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
              {...register('lastName')}
              error={errors.lastName?.message}
            />
          </div>
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
