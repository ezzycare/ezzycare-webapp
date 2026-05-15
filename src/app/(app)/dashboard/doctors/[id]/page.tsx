import DoctorDetails from '@/components/Dashboard/Doctor/DoctorDetails';

interface DoctorDetailPageProps {
  params: {
    id: string; // matches [id]
  };
}

const DoctorDetail = async ({ params }: DoctorDetailPageProps) => {
  const { id } = await params;

  const doctor = {
    id: id,
    qualifications: ['MD', 'FAAP'],
    name: 'Emily Rodriguez',
    email: 'emoryhospital@gmail.com',
    phoneNumber: '08169192646',
    specialty: 'Cardiologist',
    experience: '5 years',
    about: `Dr. Rodriguez is passionate about child health and development. 
    She provides comprehensive care for infants, children, and adolescents, 
    with a special interest in developmental pediatrics and childhood nutrition.`,
    university: 'University of California, San Francisco',
    dateGraduated: '12 May 2015',
    address: 'Highlevel, Makurdi, Benue State',
    medicalCertificate: 'MD',
    practiceLicense: '12345',
    specialtyCertificate: '12345',
    licenseExpiryDate: '12 May 2035',
  };

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl">
      <DoctorDetails doctor={doctor} />
    </div>
  );
};

export default DoctorDetail;
