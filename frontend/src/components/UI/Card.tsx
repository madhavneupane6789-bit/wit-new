import React from 'react';
import clsx from 'clsx';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div
    className={clsx(
      'glass rounded-2xl border border-white/50 p-6 shadow-glow transition duration-200 hover:-translate-y-0.5 hover:shadow-lg',
      className,
    )}
  >
    {children}
  </div>
);
