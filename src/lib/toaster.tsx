'use client';

import { InfoInvertedIconLocal } from '@/icons/DashboardIcons';
import { Cross1Icon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { AlertCircle, Info } from 'lucide-react';
import {
  toast,
  ToastContainer,
  ToastContentProps,
  ToastOptions,
} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { cn } from './utils';

/* =========================================================
   TOAST CONTAINER
========================================================= */

export function AppToaster() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      closeButton={false}
      newestOnTop
      draggable
      pauseOnHover
      theme="light"
      toastClassName={() => '!bg-transparent !shadow-none !p-0 !min-h-0'}
    />
  );
}

/* =========================================================
  TOAST UI
========================================================= */

type ToastVariant = 'success' | 'error' | 'info';

interface CustomToastOwnProps {
  title?: string;
  message: string;
  variant?: ToastVariant;
}

type CustomToastProps = CustomToastOwnProps & Partial<ToastContentProps>;

const variantStyles = {
  success: {
    wrapper: 'bg-green-5 text-green-12',
    icon: 'bg-green-6a text-green-11',
    progress: 'bg-green-9',
    Icon: InfoInvertedIconLocal,
  },

  error: {
    wrapper: 'bg-red-3a border border-red-6 text-red-12',
    icon: 'bg-red-6a text-red-11',
    progress: 'bg-red-9',
    Icon: AlertCircle,
  },

  info: {
    wrapper: 'bg-blue-3a border border-blue-6 text-blue-12',
    icon: 'bg-blue-6a text-blue-11',
    progress: 'bg-blue-9',
    Icon: Info,
  },
};

function CustomToast({
  title,
  message,
  variant = 'info',
  closeToast,
}: CustomToastProps) {
  const styles = variantStyles[variant];
  const Icon = styles.Icon;

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className={`relative overflow-hidden rounded-xl p-4 shadow-xl backdrop-blur-md min-w-85 ${styles.wrapper}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div>
            {title && (
              <h4 className="text-sm font-semibold leading-none mb-1">
                {title}
              </h4>
            )}

            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>

        <button
          onClick={() => closeToast?.()}
          className={cn(`opacity-60 transition hover:opacity-100 flex h-6 w-6 
            shrink-0 items-center justify-center rounded-full cursor-pointer ${styles.icon}`)}
        >
          <Cross1Icon className="h-4 w-4" />
        </button>
      </div>

      {/* progress bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{
          duration: 5,
          ease: 'linear',
        }}
        className={`absolute bottom-0 left-0 h-[3px] ${styles.progress}`}
      />
    </motion.div>
  );
}

/* =========================================================
  CUSTOM TOASTER API
========================================================= */

const baseOptions: ToastOptions = {
  closeButton: false,
  className: '!bg-transparent !shadow-none !p-0',
};

export const toaster = {
  success: (message: string, title?: string, options?: ToastOptions) =>
    toast(<CustomToast variant="success" title={title} message={message} />, {
      ...baseOptions,
      ...options,
    }),

  error: (message: string, title?: string, options?: ToastOptions) =>
    toast(<CustomToast variant="error" title={title} message={message} />, {
      ...baseOptions,
      ...options,
    }),

  info: (message: string, title?: string, options?: ToastOptions) =>
    toast(<CustomToast variant="info" title={title} message={message} />, {
      ...baseOptions,
      ...options,
    }),
};
