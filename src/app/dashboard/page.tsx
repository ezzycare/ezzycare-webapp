import { redirect } from 'next/navigation';
import React from 'react';

const authenticated = false;
const Dashboard = () => {
  if (!authenticated) redirect('/auth');

  return <div>Dashboard</div>;
};

export default Dashboard;
