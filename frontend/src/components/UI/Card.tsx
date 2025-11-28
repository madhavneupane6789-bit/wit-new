import React from 'react';
import clsx from 'clsx';

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({ children, className }) => (
  <div className={clsx('glass glass-3d rounded-2xl p-6 shadow-glow', className)}>
    {children}
  </div>
);
