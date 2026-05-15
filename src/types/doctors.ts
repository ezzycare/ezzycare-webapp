export type DoctorType = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  specialty: string;
  university: string;
  qualifications: string[];
  dateGraduated: string;
  about: string;
  address: string;
  experience: string;
  licenseExpiryDate: string;
  assignedHospital?: string | undefined;
  status: string;
};

export type DoctorRegistrationType = Pick<
  DoctorType,
  'id' | 'name' | 'email' | 'createdAt' | 'status'
>;
