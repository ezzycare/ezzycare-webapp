'use client';

import DoctorIcon from '@/icons/DoctorIcon';
import HospitalIcon from '@/icons/HospitalIcon';
import StethoscopeIcon from '@/icons/StethoscopeIcon';
import TestTubeIcon from '@/icons/TestTubeIcon';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const useCaseList = [
  {
    title: 'Routine Consultations',
    description:
      'Schedule consultations in advance with verified doctors — online or in person.',
    icon: DoctorIcon,
  },
  {
    title: 'Lab Test & Diagnostics',
    description:
      'Book trusted diagnostic services nearby or request home sample collection.',
    icon: TestTubeIcon,
  },
  {
    title: 'Need Urgent Care',
    description:
      'Quickly connect with available doctors or nearby hospitals for immediate medical attention.',
    icon: StethoscopeIcon,
  },
  {
    title: 'Hospital & Specialist Visits',
    description:
      'Discover hospitals, compare services, and secure appointments without long wait times.',
    icon: HospitalIcon,
  },
];

const UseCases = () => {
  const useCasesContRef = React.useRef(null);
  const useCaseItemsRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const useCaseItems = useCaseItemsRef.current?.children
        ? Array.from(useCaseItemsRef.current.children)
        : [];

      if (!useCaseItems) return;

      gsap.fromTo(
        useCaseItems,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.5,
          scrollTrigger: {
            trigger: useCasesContRef.current,
            start: 'top 70%',
          },
        }
      );
    },
    { scope: useCasesContRef }
  );

  return (
    <section
      ref={useCasesContRef}
      id="usecases-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary-text text-base font-semibold tracking-widest">
        USE CASES
      </h4>

      <h3
        className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        Get care when you need it
      </h3>

      <p
        className="text-[#788498] max-w-112.5 text-center mx-auto"
        role="description"
      >
        From urgent health concerns to routine medical needs, EzzyCare connects
        you to the right care at the right time.
      </p>

      <div
        ref={useCaseItemsRef}
        className="mt-8 sm:mt-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {useCaseList.map((useCase, index) => (
          <div
            key={index}
            className="group h-50 sm:h-68.5 flex flex-col p-7 rounded-2xl hover:text-white opacity-0
              bg-[#F7F9FE] transition-colors duration-300 cursor-pointer"
          >
            <div
              className={`${clsx(
                'absolute inset-0 bg-primary rounded-2xl',
                'group-hover:[clip-path:inset(0_0_0_0_round_12px)]',
                'transition-all duration-500 ease-out z-0'
              )} ${
                index % 2 !== 0
                  ? '[clip-path:inset(100%_0%_0%_100%)]'
                  : '[clip-path:inset(0_100%_100%_0)]'
              }`}
            />
            <h5 className="font-medium text-lg flex gap-3 items-center z-1">
              {useCase.title}
              <span>
                <useCase.icon className="text-black group-hover:text-white transition-colors duration-300" />
              </span>
            </h5>
            <p className="mt-auto text-[#788498] group-hover:text-white transition-colors duration-300 z-1">
              {useCase.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UseCases;
