import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => {
  const baseClasses = 'bg-bg-card rounded-card border border-gray-800 shadow-card p-6';
  const hoverClasses = hover ? 'transition-all duration-200 hover:border-gray-600 hover:shadow-lg hover:-translate-y-1' : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};
