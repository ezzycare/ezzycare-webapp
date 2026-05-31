import { InfoCircledIcon } from '@radix-ui/react-icons';
import { ArrowRight } from 'lucide-react';
import React from 'react';

type BannerType = 'info' | 'warning' | 'error';
const AlertBanner = ({
  title,
  content,
  btnText,
  btnIcon,
  btnAction,
  className,
  type = 'info',
  children,
}: {
  title?: string;
  content?: string;
  btnText?: string;
  btnIcon?: React.ReactNode;
  btnAction?: () => void;
  className?: string;
  type: BannerType;
  children?: React.ReactNode;
}) => {
  const baseClass = `w-full! flex flex-col md:flex-row justify-center md:justify-start 
    text-xs items-center gap-3 rounded-[16px] p-4 relative cursor-pointer`;
  const bgTypeClasses = {
    info: 'bg-gray-3a',
    warning: 'bg-warning-3a',
    error: 'bg-error-3a',
  };

  const textTypeClasses = {
    info: 'text-blue-12',
    warning: 'text-warning',
    error: 'text-error',
  };

  return (
    <div
      className={`${baseClass} ${bgTypeClasses[type]} ${className}`}
      onClick={btnAction && btnAction}
    >
      <InfoCircledIcon className={`w-6 h-6 ${textTypeClasses[type]}`} />
      <div className="w-full flex gap-2 items-center justify-between">
        <p>
          {title && (
            <span className={`font-semibold mr-1.5 ${textTypeClasses[type]}`}>
              {title}:
            </span>
          )}
          {content && (
            <span className={`${textTypeClasses[type]}`}>{content}</span>
          )}
        </p>
        {children}
        {btnAction && (
          <ArrowRight
            size={16}
            className="min-w-4 ml-auto text-text cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
