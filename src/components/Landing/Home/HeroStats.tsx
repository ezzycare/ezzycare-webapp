'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const stats = [
  { label: 'Care givers', value: 2500, unit: '+' },
  { label: 'Specialists', value: 36, unit: '+' },
  { label: 'States in Nigeria', value: 100, unit: '%' },
  { label: 'Completed Appointments', value: 8000, unit: '+' },
];

const HeroStats = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [start, setStart] = useState(false);
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStart(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!start) return;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);

      const newCounts = stats.map((stat) => Math.floor(progress * stat.value));

      setCounts(newCounts);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [start]);

  return (
    <div ref={ref} className="w-full grid grid-cols-4 justify-evenly">
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex flex-col items-center">
          <h2
            className={clsx(
              'font-geist-sans text-center font-medium text-[#005365]',
              'text:2xl sm:text-3xl md:text-[35px]'
            )}
          >
            {counts[i]}
            {!!counts[i] && <span>{stat.unit}</span>}
          </h2>
          <p className="text-xs sm:text-sm md:text-lg text-center text-[#788498]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HeroStats;
