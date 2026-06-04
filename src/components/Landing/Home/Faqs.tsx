'use client';

import { faqItems } from '@/data/faq';
import ChevronUp from '@/icons/ChevronUp';
import clsx from 'clsx';
import React from 'react';

const Faqs = () => {
  const [active, setActive] = React.useState(0);

  return (
    <section
      id="faqs-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-blue-11 text-base font-semibold tracking-widest">
        FAQS
      </h4>

      <h3
        className="text-3xl sm:text-4xl lg:text-[40px] font-medium mt-3.5 mb-3 max-w-80 sm:max-w-135 mx-auto text-center"
        role="heading"
      >
        Frequently Asked Questions
      </h3>

      <p
        className="text-text-muted max-w-112.5 text-center mx-auto"
        role="description"
      >
        Everything you need to know about getting care on EzzyCare.
      </p>

      <article className="max-w-192.5 w-full mx-auto mt-8 sm:mt-10 flex flex-col gap-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="px-6 py-5.5 bg-[#F7F9FE] rounded-lg cursor-pointer"
            onClick={() => setActive((prev) => (prev === index ? -1 : index))}
          >
            <h5 className="font-semibold flex justify-between items-center">
              {item.title}
              <span
                className={`transition-transform duration-300 ${active === index ? 'rotate-180' : ''}`}
              >
                <ChevronUp />
              </span>
            </h5>
            <p
              className={`overflow-hidden transition-all duration-300 ease-in-out text-[#5B6575] 
                ${active === index ? 'max-h-96 mt-3' : 'max-h-0'}`}
            >
              {item.content}
            </p>
          </div>
        ))}
      </article>
    </section>
  );
};

export default Faqs;
