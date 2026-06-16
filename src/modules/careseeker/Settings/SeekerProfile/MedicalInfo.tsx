import { User } from '@/apiQuery/auth/types';
import {
  UpdateProfilePayload,
  useUpdateProfileMutation,
} from '@/apiQuery/users/updateProfile';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { useState } from 'react';
import EditButton from './EditButton';
import {
  AddActivityLevelModal,
  AddAlcoholConsumptionModal,
  AddAllergiesModal,
  AddChronicDiseaseModal,
  AddCurrentMedicationsModal,
  AddFoodPreferenceModal,
  AddInjuriesModal,
  AddPastMedicationsModal,
  AddSmokingHabitsModal,
  AddSurgeriesModal,
  UpdateUserArgs,
} from './Modals';

const MedicalInfo = ({ user }: { user: User }) => {
  const [openAllergiesModal, setOpenAllergiesModal] = useState(false);
  const [openCurrentMedicationsModal, setOpenCurrentMedicationsModal] =
    useState(false);
  const [openPastMedicationsModal, setOpenPastMedicationsModal] =
    useState(false);
  const [openChronicDiseaseModal, setOpenChronicDiseaseModal] = useState(false);
  const [openInjuriesModal, setOpenInjuriesModal] = useState(false);
  const [openSurgeriesModal, setOpenSurgeriesModal] = useState(false);
  const [openSmokingHabitsModal, setOpenSmokingHabitsModal] = useState(false);
  const [openAlcoholConsumptionModal, setOpenAlcoholConsumptionModal] =
    useState(false);
  const [openActivityLevelModal, setOpenActivityLevelModal] = useState(false);
  const [openFoodPreferenceModal, setOpenFoodPreferenceModal] = useState(false);
  const authStore = useAuthStore((state: AuthStore) => state);

  const { mutate, isPending } = useUpdateProfileMutation();

  const modalKeys = {
    allergies: setOpenAllergiesModal,
    currentMedications: setOpenCurrentMedicationsModal,
    pastMedications: setOpenPastMedicationsModal,
    chronicDisease: setOpenChronicDiseaseModal,
    injuries: setOpenInjuriesModal,
    surgeries: setOpenSurgeriesModal,
    smokingHabbits: setOpenSmokingHabitsModal,
    alcoholConsumption: setOpenAlcoholConsumptionModal,
    activityLevel: setOpenActivityLevelModal,
    foodPreference: setOpenFoodPreferenceModal,
  };

  const formatList = (val: string | string[] | null | undefined) => {
    if (!val) return null;
    if (Array.isArray(val)) return val.join(', ');
    return val;
  };

  const details = [
    {
      title: 'Allergies',
      value: formatList(user.userDetails?.allergies),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.allergies?.length
              ? 'Edit Allergies'
              : 'Add Allergies'
          }
          onClick={() => setOpenAllergiesModal(true)}
        />
      ),
    },
    {
      title: 'Current Medication',
      value: formatList(user.userDetails?.currentMedications),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.currentMedications?.length
              ? 'Edit Medication'
              : 'Add Medication'
          }
          onClick={() => setOpenCurrentMedicationsModal(true)}
        />
      ),
    },
    {
      title: 'Past Medical History',
      value: formatList(user.userDetails?.pastMedications),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.pastMedications?.length
              ? 'Edit History'
              : 'Add History'
          }
          onClick={() => setOpenPastMedicationsModal(true)}
        />
      ),
    },
    {
      title: 'Chronic Disease',
      value: formatList(user.userDetails?.chronicDisease),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.chronicDisease?.length
              ? 'Edit Disease'
              : 'Add Disease'
          }
          onClick={() => setOpenChronicDiseaseModal(true)}
        />
      ),
    },
    {
      title: 'Injuries',
      value: formatList(user.userDetails?.injuries),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.injuries?.length
              ? 'Edit Injuries'
              : 'Add Injuries'
          }
          onClick={() => setOpenInjuriesModal(true)}
        />
      ),
    },
    {
      title: 'Surgeries',
      value: formatList(user.userDetails?.surgeries),
      editComponent: (
        <EditButton
          title={
            user.userDetails?.surgeries?.length
              ? 'Edit Surgeries'
              : 'Add Surgeries'
          }
          onClick={() => setOpenSurgeriesModal(true)}
        />
      ),
    },
    {
      title: 'Smoking Habit',
      value: user.userDetails?.smokingHabits,
      editComponent: (
        <EditButton
          title={user.userDetails?.smokingHabits || 'Edit habit'}
          onClick={() => setOpenSmokingHabitsModal(true)}
        />
      ),
    },
    {
      title: 'Alcohol Consumption',
      value: user.userDetails?.alcoholConsumption,
      editComponent: (
        <EditButton
          title={user.userDetails?.alcoholConsumption || 'Edit habit'}
          onClick={() => setOpenAlcoholConsumptionModal(true)}
        />
      ),
    },
    {
      title: 'Activity level',
      value: user.userDetails?.activityLevel,
      editComponent: (
        <EditButton
          title={user.userDetails?.activityLevel || 'Edit details'}
          onClick={() => setOpenActivityLevelModal(true)}
        />
      ),
    },
    {
      title: 'Food Preference',
      value: user.userDetails?.foodPreference,
      editComponent: (
        <EditButton
          title={user.userDetails?.foodPreference || 'Edit Preference'}
          onClick={() => setOpenFoodPreferenceModal(true)}
        />
      ),
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
      <AddAllergiesModal
        openModal={openAllergiesModal}
        setOpenModal={setOpenAllergiesModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddCurrentMedicationsModal
        openModal={openCurrentMedicationsModal}
        setOpenModal={setOpenCurrentMedicationsModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddPastMedicationsModal
        openModal={openPastMedicationsModal}
        setOpenModal={setOpenPastMedicationsModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddChronicDiseaseModal
        openModal={openChronicDiseaseModal}
        setOpenModal={setOpenChronicDiseaseModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddInjuriesModal
        openModal={openInjuriesModal}
        setOpenModal={setOpenInjuriesModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddSurgeriesModal
        openModal={openSurgeriesModal}
        setOpenModal={setOpenSurgeriesModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddSmokingHabitsModal
        openModal={openSmokingHabitsModal}
        setOpenModal={setOpenSmokingHabitsModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddAlcoholConsumptionModal
        openModal={openAlcoholConsumptionModal}
        setOpenModal={setOpenAlcoholConsumptionModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddActivityLevelModal
        openModal={openActivityLevelModal}
        setOpenModal={setOpenActivityLevelModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
      <AddFoodPreferenceModal
        openModal={openFoodPreferenceModal}
        setOpenModal={setOpenFoodPreferenceModal}
        loading={isPending}
        action={(keyValue) => handleUpdateUser(keyValue)}
      />
    </div>
  );
};

export default MedicalInfo;
