import { handleLogout } from '@/apiQuery/auth/logout';
import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    await handleLogout();
    router.push('/auth/login');
  };
  return { logout };
};

export default useLogout;
