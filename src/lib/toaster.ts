/* eslint-disable @typescript-eslint/no-explicit-any */
// import TickIcon from '@/assets/svg/base/tick.svg';
import { toast } from 'react-toastify';

const toaster = {
  success: (message: string, options?: { [key: string]: any }) => {
    return toast.success(message, {
      type: 'success',
      className: 'p-4 border border-[#D9F7BE] bg-[#F6FFED] rounded-lg',
      // icon: TickIcon,
      ...options,
    });
  },
  error: (message: string, options?: { [key: string]: any }) => {
    return toast.error(message, {
      type: 'error',
      className: 'p-4 border border-[##FFCCC7] bg-[##FFF2F0] rounded-lg',
      ...options,
    });
  },
};

export default toaster;
