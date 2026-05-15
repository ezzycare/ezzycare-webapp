'use client';

import { RootStore, useMainStore } from '@/stores';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { ToastItem } from './ToastItem';

export const ToastContainer: React.FC = () => {
  const toasts = useMainStore((state: RootStore) => state.toasts);

  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
