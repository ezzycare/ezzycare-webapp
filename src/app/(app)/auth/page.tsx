import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/auth/signin');
};

export default Page;
