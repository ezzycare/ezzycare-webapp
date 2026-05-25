export type StateType =
  | 'create-patient'
  | 'account-exists'
  | 'account-created'
  | 'create-patient'
  | 'book-patient'
  | 'select-care-type'
  | 'select-specialty'
  | 'out-of-scope'
  | 'select-doctor'
  | 'book-appointment'
  | 'appointment-pending';

export type SelectDoctorType = {
  id: string;
  name: string;
  about: string;
  isTopDoctor: boolean;
  verified: string;
  specialization: string;
  location: string;
  experience: string;
  fee: string;
  rating: string;
  totalReviews: string;
  reviews: {
    name: string;
    review: string;
  }[];
  timeAvailability: {
    day: string;
    timeStart: string; // like 05:30 PM
    timeEnd: string;
  }[];
  consultationCharges: {
    home: number; // per minute
    video: number; // per minute
    clinic: number; // per minute
  };
};
