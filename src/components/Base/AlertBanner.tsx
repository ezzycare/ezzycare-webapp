import { InfoCircledIcon } from '@radix-ui/react-icons';
import React from 'react';
import { Button } from '../Ui/Button';

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
  const baseClass =
    'w-full! flex flex-col md:flex-row justify-center md:justify-start items-center gap-3 rounded-[16px] p-5 relative';
  const bgTypeClasses = {
    info: 'bg-info-3a',
    warning: 'bg-warning-3a',
    error: 'bg-error-3a',
  };

  const textTypeClasses = {
    info: 'text-blue-12',
    warning: 'text-warning',
    error: 'text-error',
  };

  const buttonTypeClasses = {
    info: 'bg-info',
    warning: 'bg-warning',
    error: 'bg-error',
  };

  return (
    <div className={`${baseClass} ${bgTypeClasses[type]} ${className}`}>
      <InfoCircledIcon className={`w-6 h-6 ${textTypeClasses[type]}`} />
      <div>
        {title && (
          <p className={`text-lg font-medium ${textTypeClasses[type]}`}>
            {title}
          </p>
        )}
        {content && (
          <p className={`text-sm ${textTypeClasses[type]}`}>{content}</p>
        )}
      </div>
      {children}
      {btnText && btnAction && (
        <Button
          variant="primary"
          className={`md:ml-auto flex! items-center justify-center gap-2 ${buttonTypeClasses[type]}`}
          onClick={btnAction}
        >
          <span>{btnText}</span>
          {btnIcon && btnIcon}
        </Button>
      )}
    </div>
  );
};

export default AlertBanner;
