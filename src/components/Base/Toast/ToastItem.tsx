import { RootStore, useMainStore } from '@/stores';
import { Toast } from '@/stores/toastStore';
import { Cross1Icon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import React, { useEffect } from 'react';

interface ToastProps {
  toast: Toast;
  duration?: number;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, duration = 5000 }) => {
  const removeToast = useMainStore((state: RootStore) => state.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, removeToast]);

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-5 text-green-12'
      : 'bg-error-3a text-error';
  const iconBg = toast.type === 'success' ? 'bg-green-6a' : 'bg-error-6a';
  const IconLeft = toast.type === 'success' ? Info : Cross1Icon;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }} // slide in from the right
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }} // slide out to the right
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`flex items-center justify-between p-4 ${bgColor} rounded-lg shadow-md min-w-[320px]`}
    >
      <div className="flex items-center gap-2">
        <div className={`${iconBg} p-1 rounded-full`}>
          <IconLeft className="w-4 h-4" />
        </div>
        <span>{toast.message}</span>
      </div>
      <button onClick={() => removeToast(toast.id)}>
        <Cross1Icon className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
