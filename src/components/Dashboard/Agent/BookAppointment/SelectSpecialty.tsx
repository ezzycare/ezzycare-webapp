import Dropdown from '@/components/Ui/Dropdown';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { PersonIcon } from '@radix-ui/react-icons';
import { Info, MapPin } from 'lucide-react';
import React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StateType } from './type';

const schema = z.object({
  specialty: z.string().min(1, 'Please select a specialty'),
  location: z.string().min(2, 'Location is required'),
});

type FormValues = z.infer<typeof schema>;

const SelectSpecialty = ({
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
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      specialty: '',
      location: '',
    },
    mode: 'onChange',
  });

  const specialty = watch('specialty');

  const onSubmit = async (data: FormValues) => {
    // setState('out-of-scope');
    setState('select-doctor');

    setOpenModal(false);
  };

  return (
    <Modal
      open={openModal}
      onClose={() => setOpenModal(false)}
      size="md"
      showCloseButton
      persistent
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <span className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-3a text-gray-11a">
          <Info size={30} className="rotate-180" />
        </span>

        <h3 className="text-base font-medium text-text mt-8 mb-2">Specialty</h3>

        {/* Dropdown (controlled via RHF) */}
        <Dropdown
          placeholder="Select specialty"
          icon={<PersonIcon className="text-text-muted" />}
          fullWidth
          containerClassName="h-13!"
          value={specialty}
          onChange={(value) =>
            setValue('specialty', String(value), {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          options={[
            { value: 'Allergist', label: 'Allergist' },
            { value: 'Anesthesiologist', label: 'Anesthesiologist' },
            { value: 'Cardiologist', label: 'Cardiologist' },
            { value: 'Dentist', label: 'Dentist' },
            { value: 'Dermatologist', label: 'Dermatologist' },
            { value: 'Endocrinologist', label: 'Endocrinologist' },
            { value: 'Gynecologist', label: 'Gynecologist' },
            { value: 'Neurologist', label: 'Neurologist' },
          ]}
        />

        {errors.specialty && (
          <p className="text-xs text-red-500 mt-1">
            {errors.specialty.message}
          </p>
        )}

        <div className="my-2">
          <TextInput
            placeholder="Enter Location"
            label="Location"
            className="mt-2"
            leftIcon={<MapPin size={18} className="text-text-muted mt-2" />}
            {...register('location')}
            error={errors.location?.message}
          />
        </div>

        <div className="mt-10 flex items-center gap-3 w-full">
          <Button
            type="submit"
            className="w-full text-white"
            variant="primary"
            disabled={!isValid || isSubmitting}
            onClick={() => setState('select-doctor')}
          >
            Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SelectSpecialty;
