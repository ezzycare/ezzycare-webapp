import { User } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { UpdateDoctorProfilePayload } from '@/apiQuery/doctor/profile/types';
import { useUpdateDoctorProfileMutation } from '@/apiQuery/doctor/profile/updateProfile';
import { EditIconLocal } from '@/icons/SettingsIcons';
import { toaster } from '@/lib/toaster';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import { CategoryStore, useCategoryStore } from '@/stores/categoryStore';
import dayjs from 'dayjs';
import { FileText, GraduationCap, MapPin, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  AddAboutMeModal,
  AddClinicLocationModal,
  AddEducationModal,
  AddExperienceModal,
  AddLicenseDateModal,
  AddLocationDetailsModal,
  UpdateUserArgs,
} from './Modals';

const PersonalInfo = ({ user }: { user: DoctorProfile | User }) => {
  const [openAboutMe, setOpenAboutMe] = useState(false);
  const [openClinicLocation, setOpenClinicLocation] = useState(false);
  const [openLocationDetails, setOpenLocationDetails] = useState(false);
  const [openEducation, setOpenEducation] = useState(false);
  const [openExperience, setOpenExperience] = useState(false);
  const [openLicenseDate, setOpenLicenseDate] = useState(false);

  const authStore = useAuthStore((state: AuthStore) => state);
  const { mutate, isPending } = useUpdateDoctorProfileMutation();

  const modalKeys: Record<string, (open: boolean) => void> = {
    practicingLicenceDate: setOpenLicenseDate,
  };

  const categories = useCategoryStore(
    (state: CategoryStore) => state.categories.allCategories
  );

  const specialty = categories.find(
    (category) => category.id === user.subcategoryId
  )?.name;

  const handleUpdateUser = <K extends keyof UpdateDoctorProfilePayload>({
    key,
    value,
  }: UpdateUserArgs<K>) => {
    mutate({ [key]: value } as Pick<UpdateDoctorProfilePayload, K>, {
      onSuccess: () => {
        authStore.updateUser({ ...authStore.user, [key]: value });

        if (key in modalKeys) {
          modalKeys[key](false);
        }

        toaster.success('Profile updated successfully');
      },
      onError: () => {
        toaster.error('Failed to update profile');
      },
    });
  };

  const details = user.userDetails;

  const practicingLicenceDate = useMemo(() => {
    if (
      details?.practicingLicenceDate &&
      dayjs(details?.practicingLicenceDate).diff(dayjs(), 'day') > 0
    ) {
      return dayjs(details?.practicingLicenceDate).format('YYYY-MM-DD');
    }
    return '';
  }, [details]);

  return (
    <div className="space-y-4.25 max-w-xl mx-auto p-4">
      {/* ─── About ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">About</h3>
          <button
            onClick={() => setOpenAboutMe(true)}
            className="text-text-muted hover:text-text transition-colors p-1 cursor-pointer"
          >
            <EditIconLocal />
          </button>
        </div>
        <div className="bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 text-sm text-text-alt leading-relaxed">
          {details?.aboutUs || 'No about info added yet'}
        </div>
      </div>

      {/* ─── Clinic ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">Clinic</h3>
          <button
            onClick={() => setOpenClinicLocation(true)}
            className="text-text-muted hover:text-text transition-colors p-1 cursor-pointer"
          >
            <EditIconLocal />
          </button>
        </div>
        <div className="bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 flex items-start gap-2.75">
          <MapPin size={16} className="text-text-muted mt-1" />
          <div>
            <p className="text-sm font-medium text-text">
              {details?.clinicName || 'No clinic added'}
            </p>
            <p className="text-xs text-text-alt mt-0.5">
              {details?.clinicPlace || 'Add clinic location'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Location ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">Location</h3>
          <button
            onClick={() => setOpenLocationDetails(true)}
            className="text-text-muted hover:text-text transition-colors p-1 cursor-pointer"
          >
            <EditIconLocal />
          </button>
        </div>
        <div className="bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 flex items-start gap-2.75">
          <MapPin size={16} className="text-text-muted mt-1" />
          <div>
            <p className="text-sm font-medium text-text">
              {details?.address || 'No address added'}
            </p>
            <p className="text-xs text-text-alt mt-0.5">
              {[details?.city, details?.country].filter(Boolean).join(', ') ||
                'Add location'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Education ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">Education</h3>
          <div className="flex items-center gap-1">
            <button className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer">
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setOpenEducation(true)}
              className="text-text-muted hover:text-text transition-colors p-1 cursor-pointer"
            >
              <EditIconLocal />
            </button>
          </div>
        </div>
        <div className="bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 flex items-start gap-2.75">
          <GraduationCap size={16} className="text-text-muted mt-1" />
          <div>
            <p className="text-sm font-medium text-text">
              {details?.occupation || 'No education added'}
            </p>
            <p className="text-xs text-text-alt mt-0.5">
              {details?.registrationYear
                ? `Graduated ${details.registrationYear}`
                : 'Add education details'}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Experience ─── */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">Experience</h3>
          <div className="flex items-center gap-1">
            <button className="text-text-muted hover:text-error transition-colors p-1 cursor-pointer">
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setOpenExperience(true)}
              className="text-text-muted hover:text-text transition-colors p-1 cursor-pointer"
            >
              <EditIconLocal />
            </button>
          </div>
        </div>
        <div className="bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 flex justify-between items-start gap-3">
          <div className="flex items-start gap-2.75 flex-1">
            <MapPin size={16} className="text-text-muted mt-1" />
            <div>
              <p className="text-sm font-medium text-text">
                {details?.clinicHospitalName || 'No experience added'}
              </p>
              <p className="text-xs text-text-alt mt-0.5">{specialty || ''}</p>
              <p className="text-xs text-text-muted mt-0.5">
                {practicingLicenceDate}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0 mt-0.5">
            <button
              onClick={() => setOpenLicenseDate(true)} // TODO: add pdf viewer here
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-2 text-gray-11 hover:bg-gray-3 rounded-md text-xs font-medium transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              License
            </button>
            <p className="text-[11px] text-text-muted">
              License Date:{' '}
              <span className="text-base text-text">
                {details?.practicingLicenceDate
                  ? dayjs(details.practicingLicenceDate).format('DD/MM/YYYY')
                  : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ─── Modals ─── */}
      <AddAboutMeModal
        openModal={openAboutMe}
        setOpenModal={setOpenAboutMe}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
      <AddClinicLocationModal
        openModal={openClinicLocation}
        setOpenModal={setOpenClinicLocation}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
      <AddLocationDetailsModal
        openModal={openLocationDetails}
        setOpenModal={setOpenLocationDetails}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
      <AddEducationModal
        openModal={openEducation}
        setOpenModal={setOpenEducation}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
      <AddExperienceModal
        openModal={openExperience}
        setOpenModal={setOpenExperience}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
      <AddLicenseDateModal
        openModal={openLicenseDate}
        setOpenModal={setOpenLicenseDate}
        loading={isPending}
        user={user}
        action={(kv) => handleUpdateUser(kv)}
      />
    </div>
  );
};

export default PersonalInfo;
