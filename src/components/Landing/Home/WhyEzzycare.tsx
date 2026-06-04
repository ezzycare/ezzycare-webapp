'use client';

import WhyEzzyImage from '@/assets/img/why-ezzycare-img.png';
import TickCircle from '@/icons/TickCircle';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const uniquePoints = [
  {
    title: 'Fast Access',
    description:
      'Book consultations in minutes and access urgent or scheduled care when you need it most.',
  },
  {
    title: 'Hybrid Care',
    description:
      'Choose video consultations, home visits, or clinic appointments based on your convenience.',
  },
  {
    title: 'Verified Networks',
    description:
      'Every doctor, hospital, and lab on EzzyCare is verified to ensure safe and reliable healthcare.',
  },
  {
    title: 'Accessible for Everyone',
    description:
      'Digital booking combined with agent-assisted support ensures care is available to everyone, everywhere.',
  },
];

const WhyEzzycare = () => {
  const whyContainerRef = React.useRef(null);
  const titleRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const pointsWrapperRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const points = pointsWrapperRef.current?.children
      ? Array.from(pointsWrapperRef.current.children)
      : [];

    if (!points) return;

    gsap.fromTo(
      titleRef.current,
      { y: 70, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      imageRef.current,
      { x: -150, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'elastic.out(0.5, 0.3)',
        scrollTrigger: {
          trigger: whyContainerRef.current,
          start: 'top 80%',
        },
      }
    );

    gsap.fromTo(
      points,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: pointsWrapperRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section
      ref={whyContainerRef}
      id="why-section"
      className={clsx(
        'w-full max-w-300 mx-auto grid grid-cols-1 md:grid-cols-2  gap-y-5',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0'
      )}
    >
      <Image
        src={WhyEzzyImage}
        alt="Why Ezzycare"
        width={0}
        height={0}
        loading="lazy"
        ref={imageRef}
        className="w-full h-auto max-w-80 sm:max-w-130.25 mx-auto"
      />

      <article className="max-w-125 mx-auto font-geist-sans">
        <header ref={titleRef}>
          <h4
            className={clsx(
              'text-center md:text-left text-blue-11',
              'text-base font-semibold tracking-widest'
            )}
          >
            WHY EZZYCARE?
          </h4>
          <h3
            className={cn(
              `font-geist-sans text-3xl sm:text-4xl lg:text-[46px] font-medium mt-3.5 
              mb-3 max-w-80 sm:max-w-113 mx-auto sm:mx-0`
            )}
            role="heading"
          >
            Built for
            <span className={`opacity-60 font-playfair-display italic`}>
              Unique{' '}
            </span>
            Health Care Needs
          </h3>

          <p className="text-[#788498]" role="description">
            EzzyCare brings doctors, hospitals, and diagnostics together into
            one seamless healthcare experience, designed for speed, trust, and
            accessibility.
          </p>
        </header>

        <div ref={pointsWrapperRef}>
          {uniquePoints.map((point) => (
            <div key={point.title} className="mt-6 flex gap-4 opacity-0">
              <div className="w-8 mt-2">
                <TickCircle />
              </div>
              <div>
                <h4 className="text-base font-semibold">{point.title}</h4>
                <p className="text-sm text-[#788498]">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
};

export default WhyEzzycare;
