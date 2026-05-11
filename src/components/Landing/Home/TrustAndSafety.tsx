'use client';

import TrustSafetyImage from '@/assets/img/trust-safety-img.png';
import TickCircle from '@/icons/TickCircle';
import Image from 'next/image';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const trustAndSafetyFeats = [
  {
    title: 'Verified Doctors & Hospitals',
    description:
      'All doctors, hospitals, and laboratories undergo verification to ensure quality and professional standards.',
  },
  {
    title: 'Secure Communication',
    description:
      'Consultations, messages, and health interactions are protected through secure communication channels.',
  },
  {
    title: 'Your Health Information Stays Private',
    description:
      'Medical records are securely stored with controlled access, ensuring confidentiality and compliance with data protection standards.',
  },
  {
    title: 'You Stay in Control',
    description:
      'Only authorized providers can access your medical information, giving you full transparency and control.',
  },
];

const TrustAndSafety = () => {
  const trustContainerRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const trustItemsRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const trustItems = trustItemsRef.current?.children
        ? Array.from(trustItemsRef.current.children)
        : [];

      if (!trustItems) return;

      gsap.fromTo(
        imageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        trustItems,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.5,
          scrollTrigger: {
            trigger: trustContainerRef.current,
            start: 'top 65%',
          },
        }
      );
    },
    { scope: trustContainerRef }
  );

  return (
    <section
      ref={trustContainerRef}
      id="trust-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary-text text-base font-semibold tracking-widest">
        TRUST & SAFETY
      </h4>

      <h3
        className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        Health care you can trust
      </h3>

      <p
        className="text-[#788498] max-w-112.5 text-center mx-auto"
        role="description"
      >
        EzzyCare is built on verified medical networks, secure technology, and
        patient-first protection standards.
      </p>

      <div className="mt-8 sm:mt-15 grid grid-cols-1 md:grid-cols-2 gap-5 justify-between">
        <Image
          ref={imageRef}
          src={TrustSafetyImage}
          alt="TrustSafetyImage"
          width={0}
          height={0}
          loading="lazy"
          className="w-full h-auto max-w-80 sm:max-w-123.25 mx-auto opacity-0"
        />

        <div
          ref={trustItemsRef}
          className="h-full flex flex-col justify-between max-w-80 sm:max-w-130.25 mx-auto"
        >
          {trustAndSafetyFeats.map((feat, index) => (
            <div
              key={index}
              className="mb-6 grid grid-cols-[40px_1fr] sm:grid-cols-[60px_1fr] items-center gap-4 sm:gap-7.5 opacity-0"
            >
              <div
                className={clsx(
                  'w-10 h-10 sm:w-15 sm:h-15 flex justify-center items-center rounded-full',
                  'bg-[#F1FBFD] border border-[#DAF7FF]'
                )}
              >
                <TickCircle className="text-primary" />
              </div>

              <div>
                <h5 className="text-base font-semibold mb-1">{feat.title}</h5>
                <p className="text-[#788498] text-sm">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustAndSafety;
