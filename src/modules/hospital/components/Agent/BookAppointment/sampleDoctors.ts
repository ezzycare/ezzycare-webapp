import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';

export const doctors: DoctorProfile[] = [
  {
    id: 'doc-001',
    name: 'Dr. Sarah Johnson',
    about:
      'Experienced cardiologist specializing in preventive heart care and hypertension management.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Cardiologist',
    location: 'New York, USA',
    experience: '12 years',
    fee: '$120',
    rating: '4.9',
    totalReviews: '324',
    reviews: [
      {
        name: 'Michael Brown',
        review: 'Very attentive and explained everything clearly.',
      },
      {
        name: 'Emily Clark',
        review: 'Excellent care and professional staff.',
      },
    ],
    timeAvailability: [
      {
        day: 'Monday',
        timeStart: '09:00 AM',
        timeEnd: '01:00 PM',
      },
      {
        day: 'Wednesday',
        timeStart: '03:00 PM',
        timeEnd: '07:00 PM',
      },
    ],
    consultationCharges: {
      home: 5,
      video: 3,
      clinic: 4,
    },
  },
  {
    id: 'doc-002',
    name: 'Dr. Ahmed Bello',
    about:
      'Dedicated pediatrician with a passion for child wellness and preventive healthcare.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Pediatrician',
    location: 'Lagos, Nigeria',
    experience: '9 years',
    fee: '$80',
    rating: '4.8',
    totalReviews: '210',
    reviews: [
      {
        name: 'Grace Daniel',
        review: 'Amazing with children and very patient.',
      },
      {
        name: 'John Peters',
        review: 'Highly recommended pediatric specialist.',
      },
    ],
    timeAvailability: [
      {
        day: 'Tuesday',
        timeStart: '10:00 AM',
        timeEnd: '04:00 PM',
      },
    ],
    consultationCharges: {
      home: 4,
      video: 2,
      clinic: 3,
    },
  },
  {
    id: 'doc-003',
    name: 'Dr. Maria Gonzales',
    about:
      'Dermatologist focused on acne treatment, skincare, and cosmetic dermatology.',
    isTopDoctor: false,
    verified: 'Verified',
    specialization: 'Dermatologist',
    location: 'Madrid, Spain',
    experience: '7 years',
    fee: '$95',
    rating: '4.7',
    totalReviews: '180',
    reviews: [
      {
        name: 'Sophia Lee',
        review: 'Great results after only a few visits.',
      },
    ],
    timeAvailability: [
      {
        day: 'Friday',
        timeStart: '11:00 AM',
        timeEnd: '05:00 PM',
      },
    ],
    consultationCharges: {
      home: 6,
      video: 4,
      clinic: 5,
    },
  },
  {
    id: 'doc-004',
    name: 'Dr. James Wilson',
    about:
      'Orthopedic surgeon specializing in sports injuries and joint replacement surgeries.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Orthopedic Surgeon',
    location: 'Chicago, USA',
    experience: '15 years',
    fee: '$150',
    rating: '4.9',
    totalReviews: '412',
    reviews: [
      {
        name: 'Chris Evans',
        review: 'Recovered quickly thanks to his expertise.',
      },
    ],
    timeAvailability: [
      {
        day: 'Thursday',
        timeStart: '08:00 AM',
        timeEnd: '12:00 PM',
      },
    ],
    consultationCharges: {
      home: 7,
      video: 5,
      clinic: 6,
    },
  },
  {
    id: 'doc-005',
    name: 'Dr. Priya Sharma',
    about:
      'Gynecologist providing compassionate care for women’s reproductive health.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Gynecologist',
    location: 'Mumbai, India',
    experience: '11 years',
    fee: '$100',
    rating: '4.8',
    totalReviews: '298',
    reviews: [
      {
        name: 'Neha Kapoor',
        review: 'Very caring and knowledgeable doctor.',
      },
    ],
    timeAvailability: [
      {
        day: 'Monday',
        timeStart: '02:00 PM',
        timeEnd: '06:00 PM',
      },
    ],
    consultationCharges: {
      home: 5,
      video: 3,
      clinic: 4,
    },
  },
  {
    id: 'doc-006',
    name: 'Dr. Daniel Kim',
    about:
      'Neurologist experienced in treating migraines, epilepsy, and nervous system disorders.',
    isTopDoctor: false,
    verified: 'Verified',
    specialization: 'Neurologist',
    location: 'Seoul, South Korea',
    experience: '13 years',
    fee: '$130',
    rating: '4.6',
    totalReviews: '175',
    reviews: [
      {
        name: 'Anna White',
        review: 'Very professional and thorough diagnosis.',
      },
    ],
    timeAvailability: [
      {
        day: 'Wednesday',
        timeStart: '01:00 PM',
        timeEnd: '05:00 PM',
      },
    ],
    consultationCharges: {
      home: 8,
      video: 5,
      clinic: 6,
    },
  },
  {
    id: 'doc-007',
    name: 'Dr. Fatima Noor',
    about:
      'General physician with expertise in family medicine and preventive healthcare.',
    isTopDoctor: false,
    verified: 'Verified',
    specialization: 'General Physician',
    location: 'Abuja, Nigeria',
    experience: '6 years',
    fee: '$60',
    rating: '4.5',
    totalReviews: '143',
    reviews: [
      {
        name: 'Isaac Thomas',
        review: 'Friendly and approachable doctor.',
      },
    ],
    timeAvailability: [
      {
        day: 'Saturday',
        timeStart: '09:30 AM',
        timeEnd: '02:30 PM',
      },
    ],
    consultationCharges: {
      home: 3,
      video: 2,
      clinic: 3,
    },
  },
  {
    id: 'doc-008',
    name: 'Dr. Olivia Martin',
    about:
      'Psychiatrist helping patients manage anxiety, depression, and stress disorders.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Psychiatrist',
    location: 'Toronto, Canada',
    experience: '10 years',
    fee: '$140',
    rating: '4.9',
    totalReviews: '367',
    reviews: [
      {
        name: 'Laura Green',
        review: 'Helped me through a very difficult time.',
      },
    ],
    timeAvailability: [
      {
        day: 'Tuesday',
        timeStart: '12:00 PM',
        timeEnd: '06:00 PM',
      },
    ],
    consultationCharges: {
      home: 9,
      video: 6,
      clinic: 7,
    },
  },
  {
    id: 'doc-009',
    name: 'Dr. Ethan Walker',
    about:
      'ENT specialist treating hearing, sinus, and throat-related conditions.',
    isTopDoctor: false,
    verified: 'Verified',
    specialization: 'ENT Specialist',
    location: 'Sydney, Australia',
    experience: '8 years',
    fee: '$90',
    rating: '4.7',
    totalReviews: '201',
    reviews: [
      {
        name: 'David Young',
        review: 'Quick diagnosis and effective treatment.',
      },
    ],
    timeAvailability: [
      {
        day: 'Friday',
        timeStart: '10:00 AM',
        timeEnd: '03:00 PM',
      },
    ],
    consultationCharges: {
      home: 4,
      video: 3,
      clinic: 4,
    },
  },
  {
    id: 'doc-010',
    name: 'Dr. Linda Roberts',
    about:
      'Endocrinologist specializing in diabetes management and hormone disorders.',
    isTopDoctor: true,
    verified: 'Verified',
    specialization: 'Endocrinologist',
    location: 'London, UK',
    experience: '14 years',
    fee: '$125',
    rating: '4.9',
    totalReviews: '390',
    reviews: [
      {
        name: 'Mark Hill',
        review: 'Exceptional care and easy to communicate with.',
      },
    ],
    timeAvailability: [
      {
        day: 'Thursday',
        timeStart: '09:00 AM',
        timeEnd: '01:00 PM',
      },
    ],
    consultationCharges: {
      home: 6,
      video: 4,
      clinic: 5,
    },
  },
] as unknown as DoctorProfile[];
