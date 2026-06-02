import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { TextInput } from '@/components/Ui/TextInput';
import { HospitalIconLocal } from '@/icons/DashboardNavIcons';
import { MapPin, Search } from 'lucide-react';
import React from 'react';

const AssignAgentToDoctor = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDoctor, setSelectedDoctor] = React.useState<string>('');
  const departments = [
    'Nephology',
    'Obstetrics & Gynecology',
    'Ear, Nose & Throat',
    'Ophthalmic',
    'Mental & Psychiatric',
    'Pediatric',
    'Intensive care unit',
    'Orthopedics',
  ];

  const doctors = [
    {
      id: '1',
      name: 'John Smith',
      specialty: departments[0],
      location: 'Makurdi',
    },
    {
      id: '2',
      name: 'Jane Doe',
      specialty: departments[1],
      location: 'Lagos',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      specialty: departments[2],
      location: 'Abuja',
    },
    {
      id: '4',
      name: 'Alice Smith',
      specialty: departments[3],
      location: 'Lagos',
    },
    {
      id: '5',
      name: 'Michael Brown',
      specialty: departments[4],
      location: 'Port Harcourt',
    },
    {
      id: '6',
      name: 'Sarah Williams',
      specialty: departments[5],
      location: 'Ibadan',
    },
    {
      id: '7',
      name: 'David Miller',
      specialty: departments[6],
      location: 'Enugu',
    },
    {
      id: '8',
      name: 'Emily Davis',
      specialty: departments[7],
      location: 'Kano',
    },
    {
      id: '9',
      name: 'Daniel Wilson',
      specialty: departments[1],
      location: 'Abeokuta',
    },
    {
      id: '10',
      name: 'Sophia Taylor',
      specialty: departments[2],
      location: 'Benin City',
    },
  ];

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Assign Agent to Doctor"
        description={`Select a Doctor to assign Agent ${'John Smith'}`}
        size="md"
      >
        <div className="space-y-4 mt-4 flex w-full flex-col">
          <TextInput
            placeholder="Search doctors my name or specialty"
            leftIcon={<Search size={18} />}
            className="bg-gray-2!"
          />
          <div
            className="max-h-[60vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--primary) transparent',
            }}
          >
            <div className="space-y-2 flex flex-col bg-gray-2 rounded-lg text-sm text-text-alt p-3.5">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-surface-card rounded-lg flex items-start justify-between py-2.5 px-4.5 cursor-pointer"
                  onClick={() => setSelectedDoctor(doctor.id)}
                >
                  <div>
                    <h3 className="text-sm font-medium text-text-alt">
                      Dr. {doctor.name}
                    </h3>
                    <div className="text-xs text-text-muted flex items-center gap-7 mt-2">
                      <p className="flex items-center gap-2">
                        <HospitalIconLocal />
                        <span>{doctor.specialty}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin size={18} /> <span>{doctor.location}</span>
                      </p>
                    </div>
                  </div>
                  <RadioItem
                    name="department"
                    checked={selectedDoctor === doctor.id}
                    option={{ value: doctor.id }}
                    interactive={false}
                    onChange={() => {}}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 w-full mt-6">
            <FancyButton
              variant="outline"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </FancyButton>
            <FancyButton
              variant="primary"
              className="w-full"
              disabled={!selectedDoctor?.length}
              onClick={() => setOpenModal(false)}
            >
              Assign department
            </FancyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignAgentToDoctor;
