'use client';

import TestTubeIcon from '@/icons/TestTubeIcon';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const careItemList = [
  {
    title: 'Health care provider',
    description: `Urgent and non-urgent consultations with Doctors of various specialties via video calls. 
      Urgent and non-urgent home and clinic visits between Doctors and care seekers. 
      Home visit by nearby nurses, Physiotherapists and massage therapists at the convenience of care seekers.`,
    icon: TestTubeIcon,
  },
  {
    title: 'Medicine & Pharmacy',
    description: `Drug orders from pharmacists and home delivery of drugs. 
      Tracking of drug orders made to pharmacists in real time. 
      Drugs can be delivered at your door step with Ezzycare pharmacy.`,
    icon: TestTubeIcon,
  },
  {
    title: 'Laboratory',
    description: `Care seekers can request Laboratory tests from anywhere and nearby scientists 
      and pathologists can visit to carry out tests. Care seekers can order 
      various radiological tests like scans and get nearby radiologists 
      and radiographers to do the tests. Home sample collection with utmost safety 
      and neccessary precaution for diagnostic tests when you request lab services from Ezzycare.`,
    icon: TestTubeIcon,
  },
];

const CareItems = () => {
  const careItemsContRef = React.useRef(null);
  const careItemItemsRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const careItemItems = careItemItemsRef.current?.children
        ? Array.from(careItemItemsRef.current.children)
        : [];

      if (!careItemItems) return;

      gsap.fromTo(
        careItemItems,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: careItemsContRef.current,
            start: 'top 80%',
          },
        }
      );
    },
    { scope: careItemsContRef }
  );

  return (
    <section
      ref={careItemsContRef}
      id="usecases-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center pt-10 sm:pt-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <div
        ref={careItemItemsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {careItemList.map((careItem, index) => (
          <div
            key={index}
            className="group h-92.5 flex flex-col p-7 rounded-2xl hover:text-white opacity-0
              bg-[#F7F9FE] hover:bg-primary transition-colors duration-500 cursor-pointer"
          >
            <h5 className="font-semibold text-lg flex gap-3 items-center">
              {careItem.title}
              <span>
                <careItem.icon className="text-black group-hover:text-white transition-colors duration-300" />
              </span>
            </h5>
            <p className="mt-10 text-text-muted group-hover:text-white transition-colors duration-300">
              {careItem.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CareItems;
