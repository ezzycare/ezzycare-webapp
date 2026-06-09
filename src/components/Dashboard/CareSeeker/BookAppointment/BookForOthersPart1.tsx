'use client';

import Button from '@/components/Ui/Button';
import Dropdown from '@/components/Ui/Dropdown';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const bookForOthersSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  gender: z.string().min(1, 'Please select a gender'),
  age: z
    .string()
    .min(1, 'Age is required')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 150,
      {
        message: 'Enter a valid age',
      }
    ),
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

type BookForOthersFormValues = z.infer<typeof bookForOthersSchema>;

interface BookForOthersProps {
  onSubmit?: (data: BookForOthersFormValues) => void;
}

export const BookForOthersPart1 = ({ onSubmit }: BookForOthersProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BookForOthersFormValues>({
    resolver: zodResolver(bookForOthersSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: '',
      age: '',
      address: '',
    },
    mode: 'onBlur',
  });

  const gender = watch('gender');

  const handleFormSubmit = (data: BookForOthersFormValues) => {
    onSubmit?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full flex flex-col gap-3 mt-5"
    >
      <p className="text-base text-text font-medium">Patient details</p>

      <TextInput
        placeholder="enter full name"
        label="Full Name"
        leftIcon={<UserIconLocal className="text-text-muted" />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <TextInput
        placeholder="email@domain.com"
        label="Email"
        leftIcon={<EnvelopeClosedIcon className="text-text-muted" />}
        error={errors.email?.message}
        {...register('email')}
      />

      <PhoneInput
        placeholder=""
        label="Phone"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Dropdown
        label="Gender"
        value={gender}
        onChange={(val) => setValue('gender', val as string)}
        error={errors.gender?.message}
        options={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />
      <TextInput
        placeholder="E.g 20"
        label="Age (years)"
        error={errors.age?.message}
        {...register('age')}
      />
      <TextInput
        placeholder="Enter address"
        label="Address"
        error={errors.address?.message}
        {...register('address')}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        disabled={!isValid || isSubmitting}
      >
        Continue
      </Button>
    </form>
  );
};

export default BookForOthersPart1;
