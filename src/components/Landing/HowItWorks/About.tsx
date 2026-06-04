'use client';

import WhyEzzyImage from '@/assets/img/why-ezzycare-img.png';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React from 'react';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const whyContainerRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const titleWrapperRef = React.useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    const title = titleWrapperRef.current?.children
      ? Array.from(titleWrapperRef.current.children)
      : [];

    if (!title) return;

    gsap.fromTo(
      imageRef.current,
      { y: 150, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'elastic.out(0.5, 0.3)',
      }
    );

    gsap.fromTo(
      title,
      { y: 150, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.2,
      }
    );
  }, []);

  return (
    <section
      ref={whyContainerRef}
      id="why-section"
      className={clsx(
        'w-full max-w-300 mx-auto grid grid-cols-1 md:grid-cols-2  gap-y-5',
        'relative py-10 sm:py-20 px-5 lg:px-0 justify-between items-start'
      )}
    >
      <Image
        src={WhyEzzyImage}
        alt="Why Ezzycare"
        width={0}
        height={0}
        loading="lazy"
        ref={imageRef}
        className="w-full h-auto max-w-120.25 mx-auto opacity-0"
      />

      <article
        ref={titleWrapperRef}
        className="max-w-110 mx-auto font-geist-sans"
      >
        <h4
          className={clsx(
            'text-center md:text-left text-primary',
            'text-base font-semibold tracking-widest  opacity-0'
          )}
        >
          ABOUT EZZYCARE
        </h4>
        <h3
          className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 opacity-0"
          role="heading"
        >
          Welcome to EzzyCare
        </h3>

        <p className="text-[#788498] opacity-0" role="description">
          Ezzycare is a novel medical solution to the challenges of both
          healthcare providers and healthcare seekers. It connects health care
          seekers to the closest providers in their vicinity using their geo
          location similar to how Uber cab connects drivers to riders.
          <br />
          <br />
          Healthcare seekers pay providers via this platform. It solves the ever
          present challenge of getting service in an easy and convenient way.
          <br />
          <br />
          Health care providers decide their charges for various services.
          <br />
          <br />
          Connect with the best doctors in less than 20 seconds via geo
          location. 100% safe and secure online medical consultation.
        </p>
      </article>
    </section>
  );
};

export default About;
