'use client';

import RegisterHospital from '@/components/Auth/RegisterHospital';
import { AccountCreatedInfo } from '@/components/Auth/RegistrationState';
import UploadHospitalDocs from '@/components/Auth/UploadHospitalDocs';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const pageVariants = {
  initial: {
    opacity: 0,
    x: 40,
    scale: 0.98,
  },

  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },

  exit: {
    opacity: 0,
    x: -40,
    scale: 0.98,
  },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

const RegisterHospitalPage = () => {
  const [state, setState] = useState('register');

  return (
    <div className="flex min-h-[90vh] w-full items-center justify-center overflow-hidden pt-5 sm:pt-7.5">
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
          className="w-full flex justify-center"
        >
          {state === 'register' && <RegisterHospital updateState={setState} />}

          {state === 'upload-docs' && (
            <UploadHospitalDocs updateState={setState} />
          )}

          {state === 'created' && <AccountCreatedInfo />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RegisterHospitalPage;
