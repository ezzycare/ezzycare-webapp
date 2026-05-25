import BookingDetails from '@/components/Dashboard/Booking/BookingDetails';

interface BookingDetailPageProps {
  params: {
    id: string; // matches [id]
  };
}

const BookingDetail = async ({ params }: BookingDetailPageProps) => {
  const { id } = await params;

  const booking = {
    id: 1,
    bookingId: 'B001',
    patientName: 'John Smith',
    doctor: {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@medical.com',
      phoneNumber: '+1 (555) 123-4567',
      assignedHospital: 'Emory',
      experience: '5 years',
      specialty: 'Cardiology',
      createdAt: 'May 08, 2026 10:00 AM',
      address: 'Highlevel, Makurdi, Benue State',
      medicalCertificate: 'MD',
      practiceLicense: '12345',
      specialtyCertificate: '12345',
      licenseExpiryDate: '12 May 2035',
      qualifications: ['MD', 'FAAP'],
      university: 'University of California, San Francisco',
      dateGraduated: '12 May 2015',
      about: `Dr. Rodriguez is passionate about child health and development.`,
      status: 'active',
    },
    appointmentDate: '08069192646',
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: 'active',
  };

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl">
      <BookingDetails booking={booking} />
    </div>
  );
};

export default BookingDetail;
