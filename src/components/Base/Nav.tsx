'use client';

import AnimatedMenu from '@/components/Base/AnimatedMenu';
import FancyButton from '@/components/Ui/FancyButton';
import FullLogo from '@/icons/FullLogo';
import { navItems } from '@/utils/route';
import { useGSAP } from '@gsap/react';
import clsx from 'clsx';
import gsap from 'gsap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

const NavBar = () => {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = React.useState(false);

  const menuContainerRef = React.useRef<HTMLDivElement>(null);
  const mobileMenuTl = React.useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      gsap.set('.mobile-menu-item-holder', { y: 100, filter: 'blur(6px)' });

      gsap.set('#mobile-menu-overlay', {
        clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)',
      });

      mobileMenuTl.current = gsap
        .timeline({ paused: true })
        .to('#mobile-menu-overlay', {
          duration: 1.25,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          ease: 'power4.inOut',
        })
        .to('.mobile-menu-item-holder', {
          y: 0,
          duration: 1,
          stagger: 0.1,
          filter: 'blur(0px)',
          ease: 'power4.inOut',
          delay: -0.9,
        });
    },
    { scope: menuContainerRef }
  );

  useEffect(() => {
    if (menuOpen) {
      mobileMenuTl.current?.play();
    } else {
      mobileMenuTl.current?.reverse();
    }
  }, [menuOpen]);

  return (
    <nav
      ref={menuContainerRef}
      className="max-w-303 w-full items-center justify-between mx-auto flex py-5.5 bg-transparent"
    >
      <Link href="/" className="z-51 cursor-pointer">
        <FullLogo className="cursor-pointer h-auto w-24 sm:w-32" />
      </Link>
      <div className="max-w-148 hidden lg:flex">
        {!!navItems?.length &&
          navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`${clsx(
                'text-sm font-medium hover:text-primary ',
                'cursor-pointer hover:scale-105 transition-colors',
                'p-2.5'
              )} 
              ${pathname === item.path ? 'text-primary font-bold!' : 'text-[#005365]'}`}
            >
              {item.name}
            </Link>
          ))}
      </div>
      <div className="flex space-x-1.5 sm:space-x-2.5 items-center">
        <Link href="/auth/signin">
          <FancyButton
            variant="outline"
            className="py-1.5! sm:py-2! px-1.5! sm:px-3! text-xs! sm:text-sm!"
          >
            Sign In
          </FancyButton>
        </Link>
        <Link href="/auth/signup">
          <FancyButton
            variant="primary"
            className="py-1.5! sm:py-2! px-1.5! sm:px-3! text-xs! sm:text-sm!"
          >
            Get Started
          </FancyButton>
        </Link>
        <div
          className="lg:hidden cursor-pointer z-52"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <AnimatedMenu active={menuOpen} />
        </div>
      </div>

      {/* fullscreen drawer */}
      <div
        id="mobile-menu-overlay"
        className={`${clsx(
          'fixed lg:hidden top-0 bottom-0 left-0 right-0 bg-[#DBEBFF] z-50',
          'flex flex-col items-center justify-center space-y-10 text-lg',
          '[clip-path:polygon(0_0,100%_0,100%_0,0_0)]'
        )}
        `}
      >
        {navItems.map((item) => (
          <div
            key={item.name}
            style={{ width: 'max-content' }}
            className="overflow-hidden h-10 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)]"
          >
            <div className="mobile-menu-item-holder">
              <Link
                href={item.path}
                className={`${clsx(
                  'text-2xl text-[#005365] font-medium',
                  'hover:text-primary hover:scale-105 transition-colors',
                  'cursor-pointer p-2.5 hover:text-underline uppercase tracking-wider'
                )} ${pathname === item.path ? 'text-primary font-bold!' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
