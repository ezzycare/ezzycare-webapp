import Button from '@/components/Ui/Button';
import Modal from '@/components/Ui/Modal';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { TextInput } from '@/components/Ui/TextInput';
import { Search } from 'lucide-react';
import React from 'react';

const AssignAgentToSpecialty = ({
  openModal,
  setOpenModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDepartments, setSelectedDepartments] = React.useState<
    string[]
  >([]);
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

  const handleSelectDepartment = (department: string) => {
    if (selectedDepartments.includes(department)) {
      setSelectedDepartments(
        selectedDepartments.filter((item) => item !== department)
      );
    } else {
      setSelectedDepartments([...selectedDepartments, department]);
    }
  };
  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Assign to department"
        description="Select a department to assign Dr. Emily Rodriguez"
        size="md"
      >
        <div className="space-y-4 mt-4 flex w-full flex-col">
          <TextInput
            placeholder="Search department"
            leftIcon={<Search size={16} className="ml-0.5 text-text-muted" />}
            className="bg-gray-2!"
          />
          <div className="space-y-2 flex flex-col bg-gray-2 rounded-lg text-sm text-text-alt p-3.5">
            {departments.map((department, index) => (
              <div
                key={index}
                className="bg-surface-card rounded-lg flex items-center justify-between py-2.5 px-4.5 cursor-pointer"
                onClick={() => handleSelectDepartment(department)}
              >
                <p>{department}</p>
                <RadioItem
                  name="department"
                  checked={selectedDepartments.includes(department)}
                  option={{ value: department }}
                  interactive={false}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 w-full mt-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setOpenModal(false)}
            >
              Assign department
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssignAgentToSpecialty;
