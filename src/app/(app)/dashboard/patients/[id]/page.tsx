import PatientDetails from '@/modules/hospital/components/Patient/PatientDetails';

interface PatientDetailPageProps {
  params: {
    id: string; // matches [id]
  };
}

const PatientDetail = async ({ params }: PatientDetailPageProps) => {
  const { id } = await params;

  const patient = {
    id: Number(id),
    name: 'John Doe',
    email: 'emoryhospital@gmail.com',
    phoneNumber: '08169192646',
    lastVisit: 'May 08, 2026',
    bookings: 8,
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: 'active',
  };

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl">
      <PatientDetails patient={patient} />
    </div>
  );
};

export default PatientDetail;
