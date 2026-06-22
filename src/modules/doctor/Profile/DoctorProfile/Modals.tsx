import { User } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { UpdateDoctorProfilePayload } from '@/apiQuery/doctor/profile/types';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { Calendar, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export type UpdateUserArgs<K extends keyof UpdateDoctorProfilePayload> = {
  key: K;
  value: UpdateDoctorProfilePayload[K];
};

type ModalBaseProps = {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({
    key,
    value,
  }: UpdateUserArgs<keyof UpdateDoctorProfilePayload>) => void;
  user?: DoctorProfile | User | null;
};

// ─── About Me ────────────────────────────────────────────────────────────────

export const AddAboutMeModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [about, setAbout] = useState(user?.userDetails?.aboutUs || '');

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">About me</h3>

        <div className="mt-6">
          <textarea
            className="w-full p-3 border border-border1 rounded-lg text-sm text-text-alt outline-none resize-none bg-transparent min-h-[140px]"
            rows={5}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Write about yourself..."
          />
        </div>

        <Button
          loading={loading}
          disabled={!about || loading}
          className="mt-6 w-full"
          onClick={() => action({ key: 'aboutUs', value: about })}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

// ─── Add Address ─────────────────────────────────────────────────────────────

export const AddAddressModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [searchAddress, setSearchAddress] = useState(
    user?.userDetails?.address || ''
  );

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">Add address</h3>

        <div className="mt-6 flex flex-col gap-3">
          <TextInput
            placeholder="Search address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
            className="w-full"
          />
          {/* Map / Selection placeholder area */}
          <div className="w-full h-36 bg-blue-1 rounded-lg border border-border1" />
        </div>

        <Button
          loading={loading}
          disabled={!searchAddress || loading}
          className="mt-6 w-full"
          onClick={() => action({ key: 'address', value: searchAddress })}
        >
          Add
        </Button>
      </div>
    </Modal>
  );
};

// ─── Clinic Location ──────────────────────────────────────────────────────────

export const AddClinicLocationModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [entryMode, setEntryMode] = useState<'search' | 'manual'>('search');

  const [street, setStreet] = useState(user?.userDetails?.clinicPlace || '');
  const [state, setState] = useState(user?.userDetails?.clinicState || '');
  const [country, setCountry] = useState(
    user?.userDetails?.clinicCountry || ''
  );

  const [latitude, setLatitude] = useState<number | null>(
    user?.latitude ?? null
  );
  const [longitude, setLongitude] = useState<number | null>(
    user?.longitude ?? null
  );

  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<
    {
      place_id: string;
      description: string;
      state?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    }[]
  >([]);

  useEffect(() => {
    if (entryMode !== 'search') return;

    if (street.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const response = await fetch(
          `/api/places/autocomplete?query=${encodeURIComponent(street)}`
        );

        const data = await response.json();

        setSuggestions(data.predictions || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [street, entryMode]);

  const handleSelectAddress = (address: (typeof suggestions)[number]) => {
    setStreet(address.description);
    setState(address.state || '');
    setCountry(address.country || '');

    setLatitude(address.latitude ?? null);
    setLongitude(address.longitude ?? null);

    setSuggestions([]);
  };

  const handleSave = () => {
    action({ key: 'clinicPlace', value: street });
    action({ key: 'clinicState', value: state });
    action({ key: 'clinicCountry', value: country });

    if (latitude !== null) {
      action({ key: 'latitude', value: latitude });
    }

    if (longitude !== null) {
      action({ key: 'longitude', value: longitude });
    }

    setOpenModal(false);
  };

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="text-center font-bold text-text">Add Clinic Address</h3>

        <div className="mt-6 flex rounded-lg bg-surface-card p-1">
          <button
            type="button"
            onClick={() => setEntryMode('search')}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${
              entryMode === 'search'
                ? 'bg-primary text-white'
                : 'text-text-muted'
            }`}
          >
            Search Address
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('manual')}
            className={`flex-1 rounded-md px-3 py-2 text-sm ${
              entryMode === 'manual'
                ? 'bg-primary text-white'
                : 'text-text-muted'
            }`}
          >
            Enter Manually
          </button>
        </div>

        <div className="mt-4">
          {entryMode === 'search' ? (
            <div className="relative">
              <TextInput
                placeholder="Search clinic address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full"
              />

              {searching && (
                <p className="mt-2 text-xs text-text-muted">Searching...</p>
              )}

              {suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-border1 bg-surface-card shadow-lg">
                  {suggestions.map((item) => (
                    <button
                      key={item.place_id}
                      type="button"
                      className="w-full border-b border-border1 px-4 py-3 text-left text-sm hover:bg-surface-card"
                      onClick={() => handleSelectAddress(item)}
                    >
                      {item.description}
                    </button>
                  ))}
                </div>
              )}

              {!searching && street.length > 3 && suggestions.length === 0 && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    Address not found
                  </span>

                  <button
                    type="button"
                    onClick={() => setEntryMode('manual')}
                    className="text-xs font-medium text-primary"
                  >
                    Enter manually
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <TextInput
                placeholder="Street address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <TextInput
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />

              <TextInput
                placeholder="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <button
                type="button"
                onClick={() => setEntryMode('search')}
                className="self-start text-xs font-medium text-primary"
              >
                Back to address search
              </button>
            </div>
          )}
        </div>

        <Button
          loading={loading}
          disabled={!street || !state || !country || loading}
          className="mt-6 w-full"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

// ─── Location Details ────────────────────────────────────────────────────────

export const AddLocationDetailsModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [street, setStreet] = useState(user?.userDetails?.address || '');
  const [state, setState] = useState(user?.userDetails?.city || '');
  const [country, setCountry] = useState(user?.userDetails?.country || '');

  const handleSave = () => {
    action({ key: 'address', value: street });
    action({ key: 'city', value: state });
    action({ key: 'country', value: country });
    setOpenModal(false);
  };

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">Location details</h3>

        <div className="mt-6 flex flex-col gap-3">
          <TextInput
            placeholder="Street address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full"
          />

          <div className="relative">
            <select
              className="w-full p-3 border border-border1 rounded-lg text-sm text-text-alt outline-none bg-surface-card appearance-none cursor-pointer"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">State</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
              <option value="Rivers">Rivers</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              className="w-full p-3 border border-border1 rounded-lg text-sm text-text-alt outline-none bg-surface-card appearance-none cursor-pointer"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">Country</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Ghana">Ghana</option>
              <option value="Kenya">Kenya</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <Button
          loading={loading}
          disabled={!street || !state || !country || loading}
          className="mt-6 w-full"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

// ─── Education ──────────────────────────────────────────────────────────────

export const AddEducationModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const education = (user as DoctorProfile | undefined)?.education?.[0];
  const [degree, setDegree] = useState(education?.degreeName || '');
  const [university, setUniversity] = useState(education?.collegeName || '');
  const [startDate, setStartDate] = useState(education?.startYear || '');
  const [endDate, setEndDate] = useState(education?.endYear || '');

  const handleSave = () => {
    action({ key: 'occupation', value: degree });
    action({ key: 'yearsOfExperience', value: `${startDate} - ${endDate}` });
  };

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">Education</h3>

        <div className="mt-6 flex flex-col gap-3">
          <TextInput
            placeholder="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="w-full"
          />

          <TextInput
            placeholder="University"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full"
          />

          <div className="flex gap-3">
            <div className="relative flex-1">
              <TextInput
                type="date"
                placeholder="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pr-8 bg-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
            </div>
            <div className="relative flex-1">
              <TextInput
                type="date"
                placeholder="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pr-8 bg-transparent"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        <Button
          loading={loading}
          disabled={loading}
          className="mt-6 w-full"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

// ─── Experience ──────────────────────────────────────────────────────────────

export const AddExperienceModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [experience, setExperience] = useState(
    user?.userDetails?.totalExperienceYear || ''
  );

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-start">
        <h3 className="font-bold text-text w-full text-center">Experience</h3>

        <div className="mt-6 w-full flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">
            Years of Experience
          </label>
          <TextInput
            placeholder="E.g 4"
            type="number"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full bg-blue-1"
          />
        </div>

        <Button
          loading={loading}
          disabled={!experience || loading}
          className="mt-6 w-full"
          onClick={() =>
            action({ key: 'yearsOfExperience', value: experience })
          }
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};

// ─── License Date ────────────────────────────────────────────────────────────

export const AddLicenseDateModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
  user,
}: ModalBaseProps) => {
  const [date, setDate] = useState(
    user?.userDetails?.practicingLicenceDate || ''
  );

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">License date</h3>

        <div className="mt-6 w-full relative">
          <TextInput
            type="date"
            placeholder="Select date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pr-8 bg-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted w-4 h-4 pointer-events-none" />
        </div>

        <Button
          loading={loading}
          disabled={!date || loading}
          className="mt-6 w-full"
          onClick={() => action({ key: 'practicingLicenceDate', value: date })}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
};
