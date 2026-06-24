'use client';

import { changePassword } from '@/apiQuery/auth/changePassword';
import Toggle from '@/components/Base/Toggle';
import Button from '@/components/Ui/Button';
import { PasswordInput } from '@/components/Ui/TextInput';
import { toaster } from '@/lib/toaster';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

const SeekerAccountSettings = () => {
  const [notifications, setNotifications] = useState(
    () => typeof window !== 'undefined' && Notification.permission === 'granted'
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setNotifications(Notification.permission === 'granted');
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    if (!value) {
      setNotifications(false);
      return;
    }

    if (Notification.permission === 'granted') {
      setNotifications(true);
      return;
    }

    if (Notification.permission === 'denied') {
      toaster.info(
        'Notifications are blocked. Enable them in your browser settings.'
      );
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotifications(true);
      toaster.success('Notifications enabled');
    } else {
      setNotifications(false);
      toaster.info('Notification permission denied');
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setLoading(true);
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toaster.success('Password changed successfully');
      reset();
    } catch (err: unknown) {
      toaster.error(
        (err as { message?: string })?.message ?? 'Failed to change password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-card rounded-[10px] p-7.5 flex flex-col gap-7">
      <div className="flex items-center justify-between">
        <p className="text-text">Notifications</p>
        <Toggle value={notifications} onChange={handleNotificationToggle} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <h3 className="text-text font-semibold">Change Password</h3>

        <PasswordInput
          label="Old Password"
          placeholder="***********************"
          {...register('oldPassword')}
          error={errors.oldPassword}
        />

        <PasswordInput
          label="New Password"
          placeholder="***********************"
          {...register('newPassword')}
          error={errors.newPassword}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="***********************"
          {...register('confirmPassword')}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          disabled={loading || !isValid}
          loading={loading}
          className="w-40.5 h-11 mt-5"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default SeekerAccountSettings;
