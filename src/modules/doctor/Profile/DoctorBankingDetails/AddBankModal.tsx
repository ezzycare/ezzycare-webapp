'use client';

import { useAddBankAccountMutation } from '@/apiQuery/wallet/addBankAccount';
import { Bank } from '@/apiQuery/wallet/types';
import { useVerifyBankAccountMutation } from '@/apiQuery/wallet/verifyBankAccount';
import Button from '@/components/Ui/Button';
import Dropdown, { SelectOption } from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

const addBankSchema = z.object({
  bankId: z.number().min(1, 'Select a bank'),
  accountName: z.string().min(1, 'Account name is required'),
  accountNumber: z
    .string()
    .min(10, 'Account number must be 10 digits')
    .max(10, 'Account number must be 10 digits')
    .regex(/^\d{10}$/, 'Account number must be exactly 10 digits'),
});

type AddBankFormData = z.infer<typeof addBankSchema>;

interface AddBankModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  banks?: Bank[];
}

export const AddBankModal = ({
  openModal,
  setOpenModal,
  banks,
}: AddBankModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AddBankFormData>({
    resolver: zodResolver(addBankSchema),
    defaultValues: {
      bankId: 0,
      accountName: '',
      accountNumber: '',
    },
  });

  const { mutateAsync: verifyAccount } = useVerifyBankAccountMutation();
  const { mutate: addBankAccount, isPending: isAdding } =
    useAddBankAccountMutation({
      onSuccess: () => {
        toaster.success('Bank account added successfully');
        reset();
        setOpenModal(false);
      },
      onError: () => {
        toaster.error('Failed to add bank account');
      },
    });

  const allBanks: SelectOption[] = useMemo(
    () =>
      banks?.map((bank) => ({
        label: bank.name,
        value: String(bank.id),
      })) ?? [],
    [banks]
  );

  const selectedBankId = watch('bankId');
  const accountNumber = watch('accountNumber');
  const [verifying, setVerifying] = useState(false);

  const selectedBank = useMemo(
    () => banks?.find((b) => b.id === selectedBankId),
    [banks, selectedBankId]
  );

  useEffect(() => {
    if (selectedBankId > 0 && accountNumber.length === 10) {
      setVerifying(true);
      verifyAccount({
        bankId: selectedBankId,
        accountNumber,
      })
        .then(({ data }) => {
          if (data?.account_name) {
            setValue('accountName', data.account_name, {
              shouldValidate: true,
            });
          }
        })
        .catch(() => {
          toaster.error('Could not verify account. Check the details.');
        })
        .finally(() => setVerifying(false));
    }
  }, [accountNumber, selectedBankId, verifyAccount, setValue]);

  useEffect(() => {
    if (!openModal) {
      reset();
    }
  }, [openModal, reset]);

  const queryClient = useQueryClient();
  const onSubmit = (data: AddBankFormData) => {
    addBankAccount(
      {
        bankId: data.bankId,
        name: data.accountName,
        bankName: selectedBank?.name ?? '',
        accountNumber: data.accountNumber,
      },
      {
        onSuccess: () => {
          toaster.success('Bank account added successfully');
          reset();
          queryClient.invalidateQueries({ queryKey: ['doctor', 'profile'] });
          setOpenModal(false);
        },
        onError: () => {
          toaster.error('Failed to add bank account');
        },
      }
    );
  };

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3 className="font-bold text-text text-center">Add Bank Account</h3>

        <div className="mt-6 w-full space-y-4">
          <div>
            <Controller
              control={control}
              name="bankId"
              render={({ field }) => (
                <Dropdown
                  value={field.value ? String(field.value) : ''}
                  placeholder="Select bank"
                  onChange={(value) => field.onChange(Number(value))}
                  options={allBanks}
                  containerClassName="h-12!"
                  fullWidth
                />
              )}
            />
            {errors.bankId && (
              <p className="text-xs text-error mt-1">{errors.bankId.message}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <TextInput
                {...register('accountNumber')}
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder="Account Number"
                className="w-full h-12!"
              />
              {verifying && (
                <LoaderCircle className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary w-4 h-4" />
              )}
            </div>
            {errors.accountNumber && (
              <p className="text-xs text-error mt-1">
                {errors.accountNumber.message}
              </p>
            )}
          </div>

          <div>
            <TextInput
              {...register('accountName')}
              type="text"
              placeholder="Account Name"
              readOnly
              className="w-full h-12!"
            />
            {errors.accountName && (
              <p className="text-xs text-error mt-1">
                {errors.accountName.message}
              </p>
            )}
          </div>
        </div>

        <Button
          loading={isAdding || verifying}
          disabled={isAdding || verifying}
          className="mt-6 w-full"
          type="submit"
        >
          {isAdding ? 'Adding...' : verifying ? 'Verifying...' : 'Save'}
        </Button>
      </form>
    </Modal>
  );
};
