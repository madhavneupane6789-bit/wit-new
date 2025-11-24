import React from 'react';
import clsx from 'clsx';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'blue' | 'rose' | 'slate';
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'blue' }) => {
  const styles = {
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
    slate: 'bg-slate-100 text-slate-600',
  }[variant];

  return <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', styles)}>{children}</span>;
};
