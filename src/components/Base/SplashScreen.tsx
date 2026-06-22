'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [show, setShow] = useState(() => false);

  useEffect(() => {
    if (!show) return;

    setTimeout(() => {
      setShow(false);
    }, 2500);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-card">
      <Image
        src="/Ezzycare-logo-gif.gif"
        alt="logo-gif"
        width={200}
        height={200}
        priority
      />
    </div>
  );
};

export default SplashScreen;
