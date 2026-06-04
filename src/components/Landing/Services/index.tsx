'use client';

import MenuBoardIcon from '@/icons/MenuBoardIcon';
import clsx from 'clsx';

const servicesList = [
  {
    title: 'Food & Nutrition',
    description:
      'Customized diets to improve health, manage conditions, and wellness.',
  },
  {
    title: 'Ophthalmologist',
    description:
      'Ophthalmology services diagnose, treat, and manage eye conditions and surgeries.',
  },
  {
    title: 'Dental care',
    description:
      'Dental care services focus on oral health, prevention, and treatments.',
  },
  {
    title: 'Surgery',
    description:
      'Surgery services provide medical procedures to treat conditions and injuries.',
  },
  {
    title: 'Orthopedics',
    description:
      'Treatment of musculoskeletal injuries, disorders, and conditions.',
  },
  {
    title: 'Neurology',
    description:
      'Neurology diagnoses and treats disorders of the nervous system.',
  },
  {
    title: 'Cardiology',
    description:
      'Cardiology specializes in diagnosing and treating heart-related conditions.',
  },
  {
    title: 'Medicine & Nephrology',
    description:
      'Medicine & Nephrology focuses on kidney health and related conditions.',
  },
  {
    title: 'Dental care',
    description:
      'Dental care services focus on oral health, prevention, and treatments.',
  },
];

const Services = () => {
  return (
    <section
      id="features-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center pt-15 pb-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-primary text-base font-semibold tracking-widest">
        SERVICES
      </h4>

      <h3
        className="text-3xl sm:text-4xl font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        EzzyCare Services
      </h3>

      <p
        className="text-[#788498] max-w-118.25 text-center mx-auto"
        role="description"
      >
        We’ve got different range of services you can access on EzzyCare.
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicesList.map((feature, index) => (
          <div
            key={index}
            className={clsx(
              'relative',
              'group h-57.25 flex flex-col p-7 rounded-2xl hover:text-white',
              'bg-[#F1FBFD] transition-colors duration-300'
            )}
          >
            <div
              className={clsx(
                'absolute inset-0 bg-primary rounded-2xl',
                '[clip-path:inset(0_100%_100%_0)]',
                'group-hover:[clip-path:inset(0_0_0_0_round_12px)]',
                'transition-all duration-500 ease-out z-0'
              )}
            />
            <h5
              className={clsx(
                'font-medium flex items-center gap-3 text-lg z-1',
                'p-4.5 bg-[#DBEBFF] rounded-xl group-hover:bg-[#00ADDB94]',
                'transition-colors duration-500'
              )}
            >
              <MenuBoardIcon />
              <span>{feature.title}</span>
            </h5>
            <p className="mt-auto text-[#788498] group-hover:text-white z-1">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
