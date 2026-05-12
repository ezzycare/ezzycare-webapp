'use client';

import { useEffect, useRef, useState } from 'react';

const Tabs = ({
  tabItems,
  setActiveIndex,
}: {
  tabItems: string[];
  setActiveIndex: (index: number) => void;
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
    <div className="relative flex w-fit" role="tablist">
      <div
        className="absolute top-[calc(100%-2px)] bg-primary h-0.5 transition-all duration-300 ease-out"
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
              duration-300 cursor-pointer border-b border-border1 ${
                active === i ? 'text-text font-medium' : 'text-text-muted'
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

export default Tabs;
