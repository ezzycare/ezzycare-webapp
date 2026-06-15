import AgentDetails from '@/modules/hospital/components/Agent/AgentDetails';

interface AgentDetailPageProps {
  params: {
    id: string; // matches [id]
  };
}

const AgentDetail = async ({ params }: AgentDetailPageProps) => {
  const { id } = await params;

  const agent = {
    id: 1,
    name: 'John Smith',
    email: 'jsmith@gmail.com',
    phoneNumber: '08069192646',
    createdAt: '2023-01-01',
    address: 'Highlevel, Makurdi, Benue State',
    status: 'pending',
  };

  return (
    <div className="m-0 sm:m-6 py-8.5 pl-11 pr-6 bg-surface-card rounded-2xl">
      <AgentDetails agent={agent} />
    </div>
  );
};

export default AgentDetail;
