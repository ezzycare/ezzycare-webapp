import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { UserIconLocal } from '@/icons/DashboardNavIcons';
import { EnvelopeClosedIcon } from '@radix-ui/react-icons';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StateType } from './type';

const createPatientSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),

  emailOrPhone: z
    .string()
    .min(1, 'Email or phone number is required')
    .refine(
      (value) => {
        const isEmail = z.string().email().safeParse(value).success;

        const isPhone = /^[+]?[0-9\s\-()]{7,20}$/.test(value);

        return isEmail || isPhone;
      },
      {
        message: 'Enter a valid email or phone number',
      }
    ),
});

type CreatePatientFormValues = z.infer<typeof createPatientSchema>;

const CreatePatientModal = ({
  openModal,
  setOpenModal,
  setState,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setState: React.Dispatch<React.SetStateAction<StateType>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<CreatePatientFormValues>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      fullName: '',
      emailOrPhone: '',
    },
  });

  const onSubmit = async (data: CreatePatientFormValues) => {
    console.log(data);

    // API call here

    setState('account-exists');
    // setState('account-created');

    reset();
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Patient details"
        description="Enter the details of the patient"
        size="md"
        persistent
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex w-full flex-col"
        >
          <div className="space-y-2 mt-5 flex flex-col">
            <TextInput
              placeholder="Enter Full Name"
              label="Full Name"
              leftIcon={<UserIconLocal className="text-text-muted" />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <TextInput
              placeholder="email@domain.com"
              label="Email or phone number"
              leftIcon={<EnvelopeClosedIcon />}
              error={errors.emailOrPhone?.message}
              {...register('emailOrPhone')}
            />
          </div>

          <div className="flex w-full mt-6">
            <FancyButton
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? 'Checking...' : 'Check'}
            </FancyButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreatePatientModal;
