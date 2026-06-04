'use client';

import SlidingTabs from '@/components/Base/SlidingTabs';
import { allSteps } from '@/data/howEzzycareWorks';
import clsx from 'clsx';
import React from 'react';

const HowEzzycareWorks = ({ children }: { children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [activeOrderStep, setActiveOrderStep] = React.useState(0);

  return (
    <section
      id="how-section"
      className={clsx(
        'w-full max-w-300 mx-auto flex flex-col',
        'relative items-center py-10 sm:py-20 px-5 lg:px-0 font-geist-sans'
      )}
    >
      <h4 className="text-blue-11 text-base font-semibold tracking-widest">
        HOW IT WORKS
      </h4>

      <h3
        className="text-3xl sm:text-4xl lg:text-[46px] font-medium mt-3.5 mb-3 max-w-80 sm:max-w-130 mx-auto text-center"
        role="heading"
      >
        How Ezzycare Works
      </h3>

      <p
        className="text-[#788498] max-w-112.5 text-center mx-auto"
        role="description"
      >
        From finding a doctor to follow-up care, EzzyCare makes healthcare
        simple, fast, and connected.
      </p>

      <div className="max-w-111 w-full mt-6 flex justify-center">
        <SlidingTabs
          tabItems={allSteps.map((step) => step.title)}
          setActiveIndex={(val: number) => setActiveTab(val)}
        />
      </div>

      <div className="mt-15">
        <h4 className="text-[28px] font-medium">
          For {allSteps[activeTab]?.title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-5">
          <div className="flex flex-col mt-6 max-w-115.75">
            {allSteps[activeTab]?.steps.map((step, index) => (
              <div
                key={step.title}
                className="flex items-start gap-4 mb-2 cursor-pointer "
                onMouseEnter={() => setActiveOrderStep(index)}
              >
                <div className="w-15 relative">
                  <div
                    className={`w-15 h-15 mr-7.5 rounded-full flex items-center justify-center 
                      border border-[#DAF7FF] transition-all duration-300
                      ${activeOrderStep === index ? 'bg-[#F1FBFD] text-primary' : 'bg-white text-black'}`}
                  >
                    0{index + 1}
                  </div>

                  <div
                    className={`h-8 mt-2 w-full flex justify-center 
                      ${index === allSteps[activeTab]?.steps?.length - 1 ? 'hidden' : ''}`}
                  >
                    <svg
                      width="1"
                      height="32"
                      viewBox="0 0 1 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="0.25"
                        y1="1.09278e-08"
                        x2="0.249999"
                        y2="32"
                        stroke={activeOrderStep === index ? '#1D5FE6' : '#000'}
                        strokeWidth="0.5"
                        strokeDasharray="2 2"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <h4 className="text-base font-semibold">{step.title}</h4>
                  <p className="text-sm text-text-muted mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#F6F9FF] rounded-lg p-4 text-center h-[80%] w-[80%]">
            {allSteps[activeTab]?.steps[activeOrderStep].image}
          </div>
        </div>
        <div>{children}</div>
      </div>
    </section>
  );
};

export default HowEzzycareWorks;
