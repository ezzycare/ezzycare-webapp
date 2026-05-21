'use client';

import { useEffect, useRef, useState } from 'react';

const SlidingTabs = ({
  tabItems,
  setActiveIndex,
  containerClassName = '',
  activeIndicatorClassName = '',
  tabClassName = '',
  tabActiveClassName = '',
}: {
  tabItems: string[];
  setActiveIndex: (index: number) => void;
  containerClassName?: string;
  activeIndicatorClassName?: string;
  tabClassName?: string;
  tabActiveClassName?: string;
}) => {
  const [active, setActive] = useState(0);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentTab = tabRefs.current[active];
    if (currentTab) {
      setIndicatorStyle({
        left: currentTab.offsetLeft,
        width: currentTab.offsetWidth,
      });
    }

    setActiveIndex(active);
  }, [active]);

  return (
    <div
      className={`relative flex w-fit gap-x-2.5 rounded-2xl bg-gray-100 ${containerClassName}`}
      role="tablist"
    >
      <div
        className={`absolute top-0 bottom-0 bg-black rounded-2xl transition-all duration-300 ease-out ${activeIndicatorClassName}`}
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />

      {tabItems.map((tab, i) => (
        <button
          key={tab}
          ref={(el) => {
            tabRefs.current[i] = el;
          }}
          onClick={() => setActive(i)}
          className={`relative z-10 p-2 sm:px-4 py-2.5 text-xs md:text-sm transition-colors 
              duration-300 cursor-pointer ${
                active === i
                  ? `text-white ${tabActiveClassName}`
                  : `text-black ${tabClassName}`
              }`}
          role="tab"
          aria-selected={active === i}
          aria-controls={`tabpanel-${i}`}
          id={`tab-${i}`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SlidingTabs;
