'use client';

import { useState } from 'react';

const Toggle = ({
  states = ['On', 'Off'],
  setCurrentState,
}: {
  states: string[];
  setCurrentState: (state: string) => void;
}) => {
  const [active, setActive] = useState(states[0]);

  const handleToggleState = (val: string) => {
    setActive(val);
    setCurrentState(val);
  };
  return (
    <div className="h-[28px] w-fit rounded bg-border1 p-1 flex gap-x-1 justify-center items-center">
      {states?.map((state, i) => (
        <div
          key={i}
          className={`px-6 py-[2px] text-xs rounded cursor-pointer transition-bg duration-300 ${active === state ? 'bg-primary' : 'opacity-50 bg-transparent'}`}
          onClick={() => handleToggleState(state)}
        >
          {' '}
          {state}{' '}
        </div>
      ))}
    </div>
  );
};

export default Toggle;
