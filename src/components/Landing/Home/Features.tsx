'use client';

import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React, { useState } from 'react';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const featuresList = [
  {
    title: 'Smart Engine Discovery',
    description:
      'Search and match with doctors, hospitals, and labs based on specialty, location, availability, and urgency.',
  },
  {
    title: 'Realtime Booking System',
    description:
      'Book appointments instantly with live availability across consultations, diagnostics, and hospital visits.',
  },
  {
    title: 'Secure Medical Records',
    description:
      'Access consultation notes, prescriptions, and medical records anytime with controlled and secure access.',
  },
  {
    title: 'Integrated Payments & Wallet',
    description:
      'Pay for consultations, tests, and services securely through integrated digital payments and wallet support.',
  },
  {
    title: 'Notification & Reminders',
    description:
      'Receive real-time alerts for bookings, reminders, results, and follow-ups across web and mobile.',
  },
  {
    title: 'Agent-Assisted Booking',
    description:
      'Offline and assisted booking ensures healthcare access even for users who need guidance or support.',
  },
];

const Features = () => {
  const featuresContainerRef = React.useRef(null);
  const featuresWrapperRef = React.useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const featuresItems = featuresWrapperRef.current?.children
        ? Array.from(featuresWrapperRef.current.children)
        : [];

      if (!featuresItems) return;

      gsap.fromTo(
        featuresItems,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          delay: 0.5,
          scrollTrigger: {
            trigger: featuresContainerRef.current,
            start: 'top 70%',
          },
        }
      );
    },
    { scope: featuresContainerRef }
  );

  return (
    <section
      ref={featuresContainerRef}
      id="features-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-blue-11 text-base font-semibold tracking-widest">
        FEATURES
      </h4>

      <h3
        className="text-3xl sm:text-4xl lg:text-[46px] font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        Everything You Need for Connected{' '}
        <span className={`${styles['title-italics']} text-black`}>
          Healthcare
        </span>
      </h3>

      <p
        className="text-text-muted max-w-125 text-center mx-auto"
        role="description"
      >
        EzzyCare combines intelligent technology, verified healthcare networks,
        and seamless workflows to deliver modern healthcare experiences.
      </p>

      <div
        ref={featuresWrapperRef}
        className="mt-8 sm:mt-15 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {featuresList.map((feature, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              className={clsx(
                'relative opacity-0 text-text',
                'group h-50 sm:h-68.5 flex flex-col p-7 rounded-2xl cursor-pointer',
                'bg-[#F7F9FE] transition-colors duration-300',
                isActive || 'hover:text-white'
              )}
            >
              <div
                className={clsx(
                  'absolute inset-0 bg-primary rounded-2xl',
                  'transition-all duration-500 ease-out z-0',
                  isActive
                    ? '[clip-path:inset(0_0_0_0)]'
                    : '[clip-path:inset(0%_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]'
                )}
              />
              <h5 className="font-medium text-lg z-1">{feature.title}</h5>
              <p
                className={clsx(
                  'mt-auto z-1',
                  isActive
                    ? 'text-white'
                    : 'text-text-muted group-hover:text-white'
                )}
              >
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
