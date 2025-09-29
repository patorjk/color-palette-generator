import React from 'react';

interface StandardCardProps {
  cardClass: string;
  additionalClasses?: string;
  children: React.ReactNode;
}

const StandardCard = ({cardClass, additionalClasses = '', children}:StandardCardProps) => {
  return (<div className={`${cardClass} rounded-2xl p-6 shadow-xl ${additionalClasses}`}>{children}</div>)
}

export {StandardCard}
