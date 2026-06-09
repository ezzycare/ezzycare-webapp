'use client';

import Button from '@/components/Ui/Button';
import { PhoneInput, TextInput } from '@/components/Ui/TextInput';

import TextArea from '@/components/Ui/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const bookForOthersSchema = z.object({
  city: z.string().min(2, 'City must be at least 2 characters'),
  reason: z.string().min(2, 'Reason must be at least 5 characters'),
  promoCode: z.string().optional(),
});

type BookForOthersFormValues = z.infer<typeof bookForOthersSchema>;

interface BookForOthersProps {
  onSubmit?: (data: BookForOthersFormValues) => void;
}

export const BookForOthersPart2 = ({ onSubmit }: BookForOthersProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<BookForOthersFormValues>({
    resolver: zodResolver(bookForOthersSchema),
    defaultValues: {
      city: '',
      reason: '',
      promoCode: '',
    },
    mode: 'onBlur',
  });

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
        placeholder="Enter city"
        label="City"
        error={errors.city?.message}
        {...register('city')}
      />
      <TextArea
        placeholder="Please state the reason including any symptoms"
        label="Reason"
        error={errors.reason?.message}
        {...register('reason')}
      />

      <PhoneInput
        placeholder="Enter promo code"
        label="Promocode (optional)"
        error={errors.promoCode?.message}
        {...register('promoCode')}
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2"
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
      >
        Book Appointment
      </Button>
    </form>
  );
};

export default BookForOthersPart2;
