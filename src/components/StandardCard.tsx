import React from 'react';

interface StandardCardProps {
  additionalClasses?: string;
  children: React.ReactNode;
}

const StandardCard = ({ additionalClasses = '', children}:StandardCardProps) => {
  return (<div className={`bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl ${additionalClasses}`}>{children}</div>)
}

export {StandardCard}
