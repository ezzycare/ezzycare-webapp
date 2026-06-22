'use client';

import Button from '@/components/Ui/Button';
import ArrowTopRight from '@/icons/ArrowTopRight';
import HealthPlusIcon from '@/icons/HealthPlusIcon';
import HospitalIcon from '@/icons/HospitalIcon';
import StethoscopeIcon from '@/icons/StethoscopeIcon';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';
import styles from './Home.module.css';

gsap.registerPlugin(ScrollTrigger);

const getStartedItems = [
  {
    title: 'Book a Doctor',
    description:
      'Connect with verified doctors for instant or scheduled consultations.',
    btnTitle: 'Book a Doctor',
    icon: StethoscopeIcon,
    link: '#',
  },
  {
    title: 'Schedule a Lab Test',
    description:
      'Book diagnostic tests nearby or request sample collection at home.',
    btnTitle: 'Schedule a Lab Test',
    icon: HealthPlusIcon,
    link: '#',
  },
  {
    title: 'Visit a Hospital',
    description:
      'Find trusted hospitals and specialists without long wait times.',
    btnTitle: 'Visit a Hospital',
    icon: HospitalIcon,
    link: '#',
  },
  {
    title: 'Get Urgent Care',
    description: 'Receive immediate medical assistance when you need it most.',
    btnTitle: 'Get Urgent Care',
    icon: HealthPlusIcon,
    link: '#',
  },
];

const GetStarted = () => {
  const getStartedContRef = React.useRef(null);
  const getStartedTitleRef = React.useRef(null);
  const itemsWrapperRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const items = itemsWrapperRef.current?.children
        ? Array.from(itemsWrapperRef.current.children)
        : [];

      if (!items) return;

      gsap.fromTo(
        getStartedTitleRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: getStartedTitleRef.current,
            start: 'top 65%',
          },
        }
      );

      gsap.fromTo(
        items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: getStartedTitleRef.current,
            start: 'top 70%',
          },
        }
      );
    },
    { scope: getStartedContRef }
  );

  return (
    <div id="getstarted-section" className="w-full bg-[#F1FBFD] py-10 sm:py-15">
      <section
        ref={getStartedContRef}
        className={clsx(
          'w-full max-w-300 mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5',
          'relative items-center px-5 lg:px-0'
        )}
      >
        <div ref={getStartedTitleRef}>
          <h2
            className="text-4xl font-medium tracking-tighter"
            role="heading"
            aria-label="Get Started"
          >
            Get Started{' '}
            <span
              className={`${styles['title-italics']} font-playfair-display`}
            >
              Today
            </span>
          </h2>
          <p className="text-base text-text mt-3 mb-6" role="description">
            Take some quicks actions today and get started with improving your
            health...
          </p>
          <Button variant="primary" className="px-6! gap-2">
            Book Appointment
            <ArrowTopRight />
          </Button>
        </div>

        <div
          ref={itemsWrapperRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {getStartedItems.map((item) => (
            <div
              key={item.title}
              className={clsx(
                'group bg-surface-card rounded-lg p-4 ',
                'opacity-0 hover:bg-primary transition-color duration-300'
              )}
            >
              <div
                className={clsx(
                  'mb-5 w-11 h-11 flex items-center justify-center',
                  'text-white rounded-full bg-[#00BADE] group-hover:bg-[#00ADDB94]'
                )}
              >
                <item.icon width={13} height={14} />
              </div>
              <h3 className="text-lg font-semibold mb-2.5 text-text group-hover:text-white">
                {item.title}
              </h3>
              <p className="mb-6 max-w-75 text-sm text-text group-hover:text-white">
                {item.description}
              </p>
              <Button
                variant="primary"
                className={clsx(
                  'px-6! group-hover:bg-[#00ADDB94]! text-lg! w-full font-medium rounded-xl',
                  'items-center justify-center transition-colors gap-2'
                )}
                href={item.link}
              >
                {item.btnTitle}
                <ArrowTopRight />
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GetStarted;
