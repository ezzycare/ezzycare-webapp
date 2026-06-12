'use client';

import Button from '@/components/Ui/Button';
import { TextInput } from '@/components/Ui/TextInput';

import TextArea from '@/components/Ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { OtherUserData } from '.';

const bookForOthersSchema = z.object({
  city: z.string().min(2, 'City must be at least 2 characters'),
  reason: z.string().min(2, 'Reason must be at least 5 characters'),
  promoCode: z.string().optional(),
});

type BookForOthersFormValues = z.infer<typeof bookForOthersSchema>;

interface BookForOthersProps {
  userData: OtherUserData;
  isLoading?: boolean;
  onSubmit?: (data: BookForOthersFormValues) => void;
}

export const BookForOthersPart2 = ({
  userData,
  isLoading,
  onSubmit,
}: BookForOthersProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<BookForOthersFormValues>({
    resolver: zodResolver(bookForOthersSchema),
    defaultValues: {
      city: userData.city ?? '',
      reason: userData.reason ?? '',
      promoCode: userData.promoCode ?? '',
    },
    mode: 'onBlur',
  });

  const handleFormSubmit = (data: BookForOthersFormValues) => {
    if (!isValid) return;
    onSubmit?.(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="w-full flex flex-col gap-3 mt-5"
    >
      <p className="text-base text-text font-medium">Patient details</p>

      <TextInput
        placeholder="Enter city"
        label="City"
        className="h-10!"
        error={errors.city?.message}
        {...register('city')}
      />
      <TextArea
        placeholder="Please state the reason including any symptoms"
        label="Reason"
        error={errors.reason?.message}
        {...register('reason')}
      />

      <TextInput
        placeholder="Enter promo code"
        label="Promocode (optional)"
        className="h-10!"
        error={errors.promoCode?.message}
        {...register('promoCode')}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        disabled={!isValid || isLoading}
        loading={isLoading}
      >
        Book Appointment
      </Button>
    </form>
  );
};

export default BookForOthersPart2;
