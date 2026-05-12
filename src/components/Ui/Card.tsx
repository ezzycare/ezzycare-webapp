import React from 'react';

const Card = ({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={`p-[17px] border border-border11 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
