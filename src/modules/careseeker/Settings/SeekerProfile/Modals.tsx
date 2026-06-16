import { Gender, UpdateProfilePayload } from '@/apiQuery/users/updateProfile';
import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { TextInput } from '@/components/Ui/TextInput';
import { useState } from 'react';

export type UpdateUserArgs<K extends keyof UpdateProfilePayload> = {
  key: K;
  value: UpdateProfilePayload[K];
};

export const AddGenderModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selectedGender, setSelectedGender] = useState<Gender>('MALE');
  const genders: Gender[] = ['MALE', 'FEMALE'];

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-text">What is your gender</h3>
        <div className="flex gap-3 items-center justify-center mt-11">
          {genders.map((gender: Gender) => (
            <div
              key={gender}
              className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${selectedGender === gender ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'}`}
              onClick={() => setSelectedGender(gender)}
            >
              <RadioItem
                name="consultationTypes"
                checked={selectedGender === gender}
                option={{ value: gender }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt hover:text-text capitalize cursor-pointer">
                {gender?.toLowerCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!selectedGender || loading}
        className="mt-11 w-full"
        onClick={() => action({ key: 'gender', value: selectedGender })}
      >
        Save
      </Button>
    </Modal>
  );
};

export const AddMaritalStatusModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const maritalStatus = ['Married', 'Single'];

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-text">What is your gender</h3>
        <div className="flex gap-3 items-center justify-center mt-11">
          {maritalStatus.map((status: string) => (
            <div
              key={status}
              className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${selectedStatus === status ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'}`}
              onClick={() => setSelectedStatus(status)}
            >
              <RadioItem
                name="consultationTypes"
                checked={selectedStatus === status}
                option={{ value: status }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt hover:text-text capitalize cursor-pointer">
                {status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!selectedStatus || loading}
        className="mt-11 w-full"
        onClick={() =>
          selectedStatus &&
          action({ key: 'maritalStatus', value: selectedStatus })
        }
      >
        Save
      </Button>
    </Modal>
  );
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const AddBloodGroupModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-text">{`What's your blood group?`}</h3>
        <div className="grid grid-cols-4 gap-3 mt-8 w-full">
          {BLOOD_GROUPS.map((group) => (
            <button
              key={group}
              onClick={() => setSelected(group)}
              className={`py-2.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                selected === group
                  ? 'border-blue-11 bg-blue-3a text-blue-11'
                  : 'border-gray-4 text-text-alt hover:border-blue-11'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!selected || loading}
        className="mt-8 w-full"
        onClick={() =>
          selected && action({ key: 'bloodGroup', value: selected })
        }
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Height ──────────────────────────────────────────────────────────────────
const ScrollPicker = ({
  options,
  value,
  onChange,
  label,
}: {
  options: number[];
  value: number;
  onChange: (v: number) => void;
  label: string;
}) => (
  <div className="flex flex-col items-center gap-1 flex-1">
    <div className="relative h-28 overflow-hidden w-full flex flex-col items-center">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`w-full text-center py-1.5 text-sm transition-colors cursor-pointer ${
            opt === value
              ? 'text-text font-semibold bg-blue-2 rounded-lg'
              : 'text-text-muted'
          }`}
        >
          {String(opt).padStart(2, '0')}
        </button>
      ))}
    </div>
    <p className="text-xs text-text-muted mt-1">{label}</p>
  </div>
);

export const AddHeightModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [feet, setFeet] = useState(1);
  const [inches, setInches] = useState(1);

  const feetOptions = Array.from({ length: 8 }, (_, i) => i + 1); // 1–8 ft
  const inchOptions = Array.from({ length: 12 }, (_, i) => i); // 0–11 in

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-text">What is your height?</h3>
        <div className="flex items-end gap-4 mt-8 w-full px-4">
          <ScrollPicker
            options={feetOptions}
            value={feet}
            onChange={setFeet}
            label="Feet"
          />
          <ScrollPicker
            options={inchOptions}
            value={inches}
            onChange={setInches}
            label="Inches"
          />
        </div>
      </div>

      <Button
        loading={loading}
        disabled={loading}
        className="mt-8 w-full"
        onClick={() =>
          action({ key: 'height', value: `${feet}ft ${inches}in` })
        }
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Weight ──────────────────────────────────────────────────────────────────

export const AddWeightModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [weight, setWeight] = useState(2);
  const weightOptions = Array.from({ length: 300 }, (_, i) => i + 1); // 1–300 kg

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-text">What is your weight?</h3>
        <div className="flex items-center justify-center gap-4 mt-8 w-full">
          <div className="relative h-32 overflow-hidden w-40 flex flex-col items-center">
            {weightOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setWeight(opt)}
                className={`w-full text-center py-1.5 text-sm transition-colors cursor-pointer ${
                  opt === weight
                    ? 'text-text font-semibold bg-blue-2 rounded-lg'
                    : 'text-text-muted'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <span className="text-text-alt text-sm">Kg</span>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'weight', value: String(weight) })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Emergency Contact ───────────────────────────────────────────────────────

export const AddEmergencyContactModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    action({ key: 'emergencyContactName', value: name });
    action({ key: 'emergencyContact', value: phone });
  };

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-text text-center">
          Who is your emergency contact?
        </h3>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">Full Name</label>
          <TextInput
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text">Phone</label>
          <div className="flex items-center border border-border1 rounded-lg overflow-hidden">
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-r border-border1 bg-gray-1 shrink-0">
              <span className="fi fi-ng text-base" />
              <span className="text-sm text-text-alt">+234</span>
            </div>
            <TextInput
              type="tel"
              placeholder=""
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
            />
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!name || !phone || loading}
        className="mt-8 w-full"
        onClick={handleSave}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Allergies ───────────────────────────────────────────────────────────────

const ALLERGY_SUGGESTIONS = ['Lactose', 'Soy', 'Seafood', 'Nuts', 'Eggs'];

export const AddAllergiesModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasAllergies, setHasAllergies] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addAllergy = (allergy: string) => {
    const trimmed = allergy.trim();
    if (trimmed && !selected.includes(trimmed)) {
      setSelected((prev) => [...prev, trimmed]);
    }
    setInputValue('');
  };

  const removeAllergy = (allergy: string) => {
    setSelected((prev) => prev.filter((a) => a !== allergy));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addAllergy(inputValue);
    }
  };

  // Step 1 — Yes / No
  if (hasAllergies === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text">Are you allergic to anything?</h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Allergies'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'allergies', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasAllergies(true);
                  }
                }}
              >
                <RadioItem
                  name="allergies"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'allergies', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  // Step 2 — Add allergies
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">Add Allergies</h3>

        {/* Tag input */}
        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((a) => (
            <span
              key={a}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {a}
              <button
                onClick={() => removeAllergy(a)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add allergies' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGY_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addAllergy(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'allergies', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Current Medications ─────────────────────────────────────────────────────

const MEDICATION_SUGGESTIONS = [
  '21 Century fish oil',
  'Abidec',
  'Actinaza',
  'Acculol',
  'Afrab Vite',
  'ADAY Kit Tablet',
];

export const AddCurrentMedicationsModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasMedication, setHasMedication] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addMed = (med: string) => {
    const trimmed = med.trim();
    if (trimmed && !selected.includes(trimmed))
      setSelected((p) => [...p, trimmed]);
    setInputValue('');
  };

  const removeMed = (med: string) =>
    setSelected((p) => p.filter((m) => m !== med));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addMed(inputValue);
    }
  };

  if (hasMedication === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text text-center">
            Are you taking any medicine at the moment?
          </h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Medicine'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'currentMedications', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasMedication(true);
                  }
                }}
              >
                <RadioItem
                  name="currentMeds"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'currentMedications', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">
          Are you taking any medicine at the moment?
        </h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {m}
              <button
                onClick={() => removeMed(m)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add medicine' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addMed(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'currentMedications', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Past Medications ────────────────────────────────────────────────────────

export const AddPastMedicationsModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasPastMeds, setHasPastMeds] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addMed = (med: string) => {
    const trimmed = med.trim();
    if (trimmed && !selected.includes(trimmed))
      setSelected((p) => [...p, trimmed]);
    setInputValue('');
  };

  const removeMed = (med: string) =>
    setSelected((p) => p.filter((m) => m !== med));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addMed(inputValue);
    }
  };

  if (hasPastMeds === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text text-center">
            Have you been on any medication in the past?
          </h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Medicine'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'pastMedications', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasPastMeds(true);
                  }
                }}
              >
                <RadioItem
                  name="pastMeds"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'pastMedications', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">
          Have you been on any medication in the past?
        </h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((m) => (
            <span
              key={m}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {m}
              <button
                onClick={() => removeMed(m)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add medicine' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {MEDICATION_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addMed(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'pastMedications', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Chronic Disease ─────────────────────────────────────────────────────────

const DISEASE_SUGGESTIONS = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'COPD',
  'Hypothyroidism',
  'PCOS',
];

export const AddChronicDiseaseModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasDisease, setHasDisease] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addDisease = (d: string) => {
    const trimmed = d.trim();
    if (trimmed && !selected.includes(trimmed))
      setSelected((p) => [...p, trimmed]);
    setInputValue('');
  };

  const removeDisease = (d: string) =>
    setSelected((p) => p.filter((x) => x !== d));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addDisease(inputValue);
    }
  };

  if (hasDisease === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text text-center">
            Do you have any chronic illness?
          </h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Disease'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'chronicDisease', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasDisease(true);
                  }
                }}
              >
                <RadioItem
                  name="chronicDisease"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'chronicDisease', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">
          Do you have any chronic illness?
        </h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((d) => (
            <span
              key={d}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {d}
              <button
                onClick={() => removeDisease(d)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add disease' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {DISEASE_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addDisease(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'chronicDisease', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Injuries ────────────────────────────────────────────────────────────────

const INJURY_SUGGESTIONS = ['Burns', 'Spinal cord injury', 'Spinal fracture'];

export const AddInjuriesModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasInjury, setHasInjury] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addInjury = (i: string) => {
    const trimmed = i.trim();
    if (trimmed && !selected.includes(trimmed))
      setSelected((p) => [...p, trimmed]);
    setInputValue('');
  };

  const removeInjury = (i: string) =>
    setSelected((p) => p.filter((x) => x !== i));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInjury(inputValue);
    }
  };

  if (hasInjury === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text text-center">
            Have you had any injuries in the past?
          </h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Accident'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'injuries', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasInjury(true);
                  }
                }}
              >
                <RadioItem
                  name="injuries"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'injuries', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">
          Have you had any injuries in the past?
        </h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {i}
              <button
                onClick={() => removeInjury(i)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add incident' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {INJURY_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addInjury(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'injuries', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Surgeries ───────────────────────────────────────────────────────────────

const SURGERY_SUGGESTIONS = ['Heart', 'Liver', 'Kidney', 'Lungs', 'Brain'];

export const AddSurgeriesModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [hasSurgery, setHasSurgery] = useState<boolean | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addSurgery = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !selected.includes(trimmed))
      setSelected((p) => [...p, trimmed]);
    setInputValue('');
  };

  const removeSurgery = (s: string) =>
    setSelected((p) => p.filter((x) => x !== s));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSurgery(inputValue);
    }
  };

  if (hasSurgery === null) {
    return (
      <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-text text-center">
            Any past surgeries?
          </h3>
          <div className="flex gap-3 items-center justify-center mt-11">
            {(['No', 'Surgeries'] as const).map((opt) => (
              <div
                key={opt}
                className={`w-35 p-2 rounded-lg flex items-center gap-2 cursor-pointer border ${
                  opt === 'No' ? 'border-blue-11 bg-blue-3a' : 'border-gray-4'
                }`}
                onClick={() => {
                  if (opt === 'No') {
                    action({ key: 'surgeries', value: [] });
                    setOpenModal(false);
                  } else {
                    setHasSurgery(true);
                  }
                }}
              >
                <RadioItem
                  name="surgeries"
                  checked={opt === 'No'}
                  option={{ value: opt }}
                  onChange={() => {}}
                  interactive={false}
                />
                <p className="text-sm text-text-alt hover:text-text cursor-pointer">
                  {opt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <Button
          loading={loading}
          className="mt-11 w-full"
          onClick={() => {
            action({ key: 'surgeries', value: [] });
            setOpenModal(false);
          }}
        >
          Save
        </Button>
      </Modal>
    );
  }

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">Any past surgeries?</h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center border border-border1 rounded-lg px-3 py-2">
          {selected.map((s) => (
            <span
              key={s}
              className="flex items-center gap-1 bg-blue-3a text-blue-11 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              {s}
              <button
                onClick={() => removeSurgery(s)}
                className="ml-0.5 leading-none cursor-pointer"
              >
                ×
              </button>
            </span>
          ))}
          <TextInput
            type="text"
            placeholder={selected.length === 0 ? 'Add surgeries' : ''}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>

        <div>
          <p className="text-xs text-text-muted mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-2">
            {SURGERY_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addSurgery(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border1 text-text-alt hover:border-blue-11 hover:text-blue-11 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        loading={loading}
        disabled={selected.length === 0 || loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'surgeries', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Smoking Habits ──────────────────────────────────────────────────────────

const SMOKING_OPTIONS = [
  { label: "I don't smoke", value: 'none' },
  { label: "I used to, but I've quit", value: 'quit' },
  { label: '1-2 per day', value: '1-2' },
  // extend with more options as needed
];

export const AddSmokingHabitsModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selected, setSelected] = useState<string>('none');

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-text text-center">
          How many cigarettes do you smoke per day?
        </h3>

        <div className="flex flex-col gap-2 mt-4">
          {SMOKING_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                selected === opt.value
                  ? 'border-blue-11 bg-blue-3a'
                  : 'border-gray-4 hover:border-gray-8a'
              }`}
            >
              <RadioItem
                name="smokingHabits"
                checked={selected === opt.value}
                option={{ value: opt.value }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt">{opt.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'smokingHabbits', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Alcohol Consumption ─────────────────────────────────────────────────────

const ALCOHOL_OPTIONS = [
  { label: 'None-drinker', value: 'none' },
  { label: 'Rare', value: 'rare' },
  { label: 'Social', value: 'social' },
  { label: 'Regular', value: 'regular' },
  { label: 'Heavy', value: 'heavy' },
];

export const AddAlcoholConsumptionModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selected, setSelected] = useState<string>('heavy');

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-text text-center">
          How frequent do you consume alcohol?
        </h3>

        <div className="flex flex-col gap-2 mt-4">
          {ALCOHOL_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                selected === opt.value
                  ? 'border-blue-11 bg-blue-3a'
                  : 'border-gray-4 hover:border-gray-8a'
              }`}
            >
              <RadioItem
                name="alcoholConsumption"
                checked={selected === opt.value}
                option={{ value: opt.value }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt">{opt.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'alcoholConsumption', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

// ─── Activity Level ──────────────────────────────────────────────────────────

const ACTIVITY_OPTIONS = [
  { label: 'Sedentary (low)', value: 'sedentary' },
  { label: 'Moderately active (normal)', value: 'moderate' },
  { label: 'Active (high)', value: 'active' },
  { label: 'Athletic (very high)', value: 'athletic' },
];

export const AddActivityLevelModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selected, setSelected] = useState<string>('sedentary');

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-text text-center">
          How active is your lifestyle?
        </h3>

        <div className="flex flex-col gap-2 mt-4">
          {ACTIVITY_OPTIONS.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                selected === opt.value
                  ? 'border-blue-11 bg-blue-3a'
                  : 'border-gray-4 hover:border-gray-8a'
              }`}
            >
              <RadioItem
                name="activityLevel"
                checked={selected === opt.value}
                option={{ value: opt.value }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt">{opt.label}</p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={loading}
        className="mt-8 w-full"
        onClick={() => action({ key: 'activityLevel', value: selected })}
      >
        Save
      </Button>
    </Modal>
  );
};

export const AddFoodPreferenceModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: ({ key, value }: UpdateUserArgs<keyof UpdateProfilePayload>) => void;
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('Vegetarian');
  const options = ['Vegetarian', 'Non-vegetarian', 'Eggtarian', 'Vegan'];

  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col">
        <h3 className="font-bold text-text text-center">
          What does your diet mainly contain?
        </h3>
        <div className="mt-6 space-y-3">
          {options.map((option) => (
            <div
              key={option}
              className={`w-full p-3 rounded-lg flex items-center gap-3 cursor-pointer border ${
                selectedOption === option
                  ? 'border-blue-11 bg-blue-3a'
                  : 'border-gray-4 bg-gray-2'
              }`}
              onClick={() => setSelectedOption(option)}
            >
              <RadioItem
                name="diet"
                checked={selectedOption === option}
                option={{ value: option }}
                onChange={() => {}}
                interactive={false}
              />
              <p className="text-sm text-text-alt hover:text-text capitalize cursor-pointer">
                {option}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!selectedOption || loading}
        className="mt-6 w-full"
        onClick={() => action({ key: 'foodPreference', value: selectedOption })}
      >
        Save
      </Button>
    </Modal>
  );
};
