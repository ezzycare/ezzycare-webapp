'use client';

import clsx from 'clsx';
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const TextArea = ({
  label,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: TextAreaProps) => {
  const [text, setText] = React.useState(props?.value ?? '');

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // reset height
    e.target.style.height = e.target.scrollHeight + 'px'; // expand
    setText(e.target.value);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-medium text-text tracking-wide">
          {label}
        </label>
      )}

      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-2 top-2 text-neutral-11a">
            {leftIcon}
          </div>
        )}

        <textarea
          {...props}
          value={text}
          onChange={handleInput}
          className={clsx(
            'w-full min-h-[80px] border border-neutral-3a bg-surface-card text-text',
            'text-sm rounded-xl px-4 py-3 outline-none resize-none',
            leftIcon ? 'pl-8' : '',
            rightIcon ? 'pr-8' : '',
            className
          )}
        />

        {rightIcon && (
          <div className="absolute right-2 top-2 text-neutral-11a">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
