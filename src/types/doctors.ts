export type DoctorType = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  specialty: string;
  experience: string;
  assignedHospital?: string | undefined;
  status: string;
};

export type DoctorRegistrationType = Pick<
  DoctorType,
  'id' | 'name' | 'email' | 'createdAt' | 'status'
>;
