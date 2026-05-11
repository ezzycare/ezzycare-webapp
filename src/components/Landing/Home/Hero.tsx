'use client';

import ArrowTopRight from '@/icons/ArrowTopRight';
import FancyButton from '@/components/Ui/FancyButton';
import styles from './Home.module.css';
import HeroStats from './HeroStats';
import Image from 'next/image';
import LeftHeroImage from '@/assets/img/left-hero-img.png';
import RightHeroImage from '@/assets/img/right-hero-img.png';
import clsx from 'clsx';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import React, { useEffect, useMemo } from 'react';
import { SplitText } from 'gsap/all';

gsap.registerPlugin(SplitText);

const Hero = () => {
  const titleRef = React.useRef(null);
  const leftImageRef = React.useRef(null);
  const rightImageRef = React.useRef(null);

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        gsap.to(leftImageRef.current, { opacity: 0.3 });
        gsap.to(rightImageRef.current, { opacity: 0.3 });
      } else {
        gsap.to(leftImageRef.current, { opacity: 1 });
        gsap.to(rightImageRef.current, { opacity: 1 });
      }
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  useGSAP(() => {
    const leftImage = leftImageRef.current;
    const rightImage = rightImageRef.current;

    if (leftImage && rightImage) {
      gsap.fromTo(
        leftImage,
        { x: -150, rotate: 15, opacity: 0 },
        {
          x: 0,
          rotate: 0,
          opacity: isMobile ? 0.3 : 1,
          duration: 1.5,
          ease: 'elastic.out(0.5, 0.3)',
        }
      );

      gsap.fromTo(
        rightImage,
        { x: 150, rotate: -15, opacity: 0 },
        {
          x: 0,
          rotate: 0,
          opacity: isMobile ? 0.3 : 1,
          duration: 1.5,
          ease: 'elastic.out(0.5, 0.3)',
        }
      );
    }
  }, []);

  return (
    <section
      className={clsx(
        'w-full min-h-[70vh] max-h-187.5 sm:min-h-[80vh] sm:max-h-auto max-w-300 mx-auto flex flex-col',
        'relative items-center pt-10 sm:pt-30 pb-10 sm:pb-20 px-5 lg:px-0'
      )}
    >
      <div ref={titleRef} className="opacity-100">
        <h1
          className={clsx(
            'max-w-156 leading-12 tracking-tighter font-geist-sans',
            'text-4xl! sm:text-[46px] text-center font-medium text-[#005365] mb-4'
          )}
          role="heading"
        >
          Access <span className={styles['title-blue']}>Doctors</span>,{' '}
          <span className={styles['title-blue']}>Hospitals</span>, and{' '}
          <span className={styles['title-blue']}>Labs</span> - Anywhere, Anytime
        </h1>
        <p
          className="max-w-150 text-center text-base text-[#5B6575] px-5"
          role="description"
        >
          A unified healthcare platform connecting patients, doctors, and
          hospitals through seamless digital and physical care.{' '}
        </p>

        <div className="flex space-x-2 sm:space-x-4 justify-center mt-10">
          <FancyButton variant="outline" className="px-3! sm:px-6!">
            Explore Hospitals
          </FancyButton>
          <FancyButton
            variant="primary"
            icon={<ArrowTopRight />}
            className="px-3! sm:px-6! text-sm!"
          >
            Book Appointment
          </FancyButton>
        </div>
      </div>

      <div className="w-full mt-auto">
        <HeroStats />
      </div>

      {/* hero left and right images */}
      <Image
        ref={leftImageRef}
        src={LeftHeroImage}
        alt="hero-left"
        width={288}
        height={0}
        loading="eager"
        className="absolute top-40 sm:top-30 left-5 sm:left-10 -z-10 opacity-0"
      />

      <Image
        ref={rightImageRef}
        src={RightHeroImage}
        alt="hero-right"
        width={288}
        height={0}
        loading="eager"
        className="absolute top-40 sm:top-30 right-5 sm:right-10 -z-10 opacity-0"
      />
    </section>
  );
};

export default Hero;
