'use client';

import FancyButton from '@/components/Ui/FancyButton';
import {
  PasswordInput,
  PhoneInput,
  TextInput,
} from '@/components/Ui/TextInput';
import { HospitalIconLocal, UserIconLocal } from '@/icons/DashboardNavIcons';
import { toaster } from '@/lib/toaster';
import { RootStore } from '@/stores';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import { MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Card from '../Ui/Card';

const HospitalRegistrationSchema = z.object({
  // email: z.email('Enter a valid email address'),
  // hospitalName: z.string(),
  // phone: z.string(),
  // location: z.string(),
  // adminName: z.string(),
  // password: z.string().min(8, 'Password must be at least 8 characters long'),
  hospitalName: z.string('Enter any string for test'),
  email: z.string('Enter any string for test'),
  phone: z.string('Enter any string for test'),
  location: z.string('Enter any string for test'),
  adminName: z.string('Enter any string for test'),
  password: z.string('Enter any string for Test'),
});
type HospitalRegistration = z.infer<typeof HospitalRegistrationSchema>;

const IS_TEST = true;

const RegisterHospital = ({
  updateState,
}: {
  updateState: (val: string) => void;
}) => {
  const router = useRouter();

  const hospitalRegDetails = useAuthStore(
    (state: RootStore) => state.hospitalRegDetails
  );

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(HospitalRegistrationSchema),
  });

  const onSubmit = async (data: HospitalRegistration) => {
    if (IS_TEST) {
      setLoading(true);
      setTimeout(() => {
        toaster.success('Login successful');
        setLoading(false);
        hospitalRegDetails.setHospitalRegDetails(data);
        updateState('upload-docs');
      }, 2000);
      return;
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
            placeholder="Enter hospital name"
            label="Hospital Name"
            leftIcon={<HospitalIconLocal className="text-text-muted" />}
            {...register('hospitalName')}
            name="hospitalName"
            error={errors.hospitalName?.message}
          />
          <TextInput
            placeholder="Email"
            label="Hospital Email"
            leftIcon={<EnvelopeClosedIcon />}
            {...register('email')}
            name="email"
            error={errors.email?.message}
          />
          <PhoneInput
            placeholder="Enter phone number"
            label="Phone"
            {...register('phone')}
            name="phone"
            error={errors.phone?.message}
          />
          <TextInput
            placeholder="Hospital address"
            label="Location"
            leftIcon={<MapPinIcon size={18} className="text-text-muted" />}
            {...register('location')}
            name="location"
            error={errors.location?.message}
          />
          <TextInput
            placeholder="Admin name"
            label="Admin Name"
            leftIcon={<UserIconLocal className="text-text-muted" />}
            {...register('adminName')}
            name="adminName"
            error={errors.adminName?.message}
          />
          <PasswordInput
            placeholder="************"
            label="Password"
            {...register('password')}
            name="password"
            error={errors.password?.message}
          />
          <FancyButton
            type="submit"
            className="w-full mt-10 h-12 flex justify-center"
            variant="primary"
            loading={loading}
            disabled={Object.keys(errors).length > 0 || loading}
          >
            Continue
          </FancyButton>
        </form>
      </div>
    </Card>
  );
};

export default RegisterHospital;
