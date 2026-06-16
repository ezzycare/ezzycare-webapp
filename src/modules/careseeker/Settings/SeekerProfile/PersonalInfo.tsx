import { User } from '@/apiQuery/auth/types';
import {
  UpdateProfilePayload,
  useUpdateProfileMutation,
} from '@/apiQuery/users/updateProfile';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import dayjs from 'dayjs';
import { useState } from 'react';
import EditButton from './EditButton';
import {
  AddBloodGroupModal,
  AddEmergencyContactModal,
  AddGenderModal,
  AddHeightModal,
  AddMaritalStatusModal,
  AddWeightModal,
  UpdateUserArgs,
} from './Modals';

const PersonalInfo = ({ user }: { user: User }) => {
  const [openGenderModal, setOpenGenderModal] = useState(false);
  const [openBloodGroupModal, setOpenBloodGroupModal] = useState(false);
  const [openMaritalStatusModal, setOpenMaritalStatusModal] = useState(false);
  const [openHeightModal, setOpenHeightModal] = useState(false);
  const [openWeightModal, setOpenWeightModal] = useState(false);
  const [openEmergencyContactModal, setOpenEmergencyContactModal] =
    useState(false);
  const authStore = useAuthStore((state: AuthStore) => state);

  const { mutate, isPending } = useUpdateProfileMutation();

  const modalKeys = {
    gender: setOpenGenderModal,
    bloodGroup: setOpenBloodGroupModal,
    maritalStatus: setOpenMaritalStatusModal,
    height: setOpenHeightModal,
    weight: setOpenWeightModal,
    emergencyContact: setOpenEmergencyContactModal,
    emergencyContactName: setOpenEmergencyContactModal,
  };

  const details = [
    { title: 'Phone Number', value: user.mobileNo },
    { title: 'Email', value: user.email },
    {
      title: 'Gender',
      value: user.gender?.toLowerCase(),
      editComponent: (
        <EditButton
          title={user.gender}
          onClick={() => setOpenGenderModal(true)}
        />
      ),
    },
    {
      title: 'Date of Birth',
      value: user.userDetails?.dob
        ? dayjs(user.userDetails?.dob).format('DD-MM-YYYY')
        : null,
    },

    {
      title: 'Blood Group',
      value: user.userDetails?.bloodGroup,
      editComponent: (
        <EditButton
          title={user.userDetails?.bloodGroup || 'Edit blood group'}
          onClick={() => setOpenBloodGroupModal(true)}
        />
      ),
    },
    {
      title: 'Marital Status',
      value: user.userDetails?.maritalStatus,
      editComponent: (
        <EditButton
          title={user.userDetails?.maritalStatus || 'Edit marital status'}
          onClick={() => setOpenMaritalStatusModal(true)}
        />
      ),
    },
    {
      title: 'Height',
      value: user.userDetails?.height,
      editComponent: (
        <EditButton
          title={
            user.userDetails?.height != null
              ? `${user.userDetails.height}ft`
              : 'Edit height'
          }
          onClick={() => setOpenHeightModal(true)}
        />
      ),
    },
    {
      title: 'Weight',
      value: user.userDetails?.weight,
      editComponent: (
        <EditButton
          title={
            user.userDetails?.weight != null
              ? `${user.userDetails.weight}kg`
              : 'Edit weight'
          }
          onClick={() => setOpenWeightModal(true)}
        />
      ),
    },
    {
      title: 'Emergency Contact',
      value: user.userDetails?.emergencyContact,
      editComponent: (
        <EditButton
          title={
            user.userDetails?.emergencyContact
              ? user.userDetails?.emergencyContact
              : 'Add contact'
          }
          onClick={() => setOpenEmergencyContactModal(true)}
        />
      ),
    },
    {
      title: 'Occupation',
      value: user.userDetails?.occupation,
      editComponent: <EditButton title="Edit Occupation" onClick={() => {}} />,
    },
  ];

  const handleUpdateUser = <K extends keyof UpdateProfilePayload>({
    key,
    value,
  }: UpdateUserArgs<K>) => {
    mutate(
      {
        [key]: value,
      } as Pick<UpdateProfilePayload, K>,
      {
        onSuccess: () => {
          authStore.updateUser({
            ...authStore.user,
            [key]: value,
          });

          if (key in modalKeys) {
            modalKeys[key as keyof typeof modalKeys](false);
          }

          toaster.success('Profile updated successfully');
        },
        onError: () => {
          toaster.error('Failed to update profile');
        },
      }
    );
  };

  return (
    <div className="grid grid-cols-2 justify-between items-center gap-3 sm:gap-y-8.5 mt-1">
      {details.map((detail) => (
        <div key={detail.title} className="space-y-2">
          <p className="text-sm text-text-muted">{detail.title}</p>
          {detail?.editComponent ? (
            detail.editComponent
          ) : (
            <p className="text-sm text-text capitalize">{detail.value}</p>
          )}
        </div>
      ))}
      <AddGenderModal
        openModal={openGenderModal}
        setOpenModal={setOpenGenderModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddBloodGroupModal
        openModal={openBloodGroupModal}
        setOpenModal={setOpenBloodGroupModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddMaritalStatusModal
        openModal={openMaritalStatusModal}
        setOpenModal={setOpenMaritalStatusModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddHeightModal
        openModal={openHeightModal}
        setOpenModal={setOpenHeightModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddWeightModal
        openModal={openWeightModal}
        setOpenModal={setOpenWeightModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddEmergencyContactModal
        openModal={openEmergencyContactModal}
        setOpenModal={setOpenEmergencyContactModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
    </div>
  );
};

export default PersonalInfo;
