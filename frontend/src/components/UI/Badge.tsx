import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'ADMIN' | string | null;
};

export const Badge: React.FC<BadgeProps> = ({ children, status }) => {
  const baseClasses = 'px-2 py-0.5 text-xs font-semibold rounded-full';

  const statusClasses = {
    ACTIVE: 'bg-green-500/20 text-green-300',
    PENDING: 'bg-amber-500/20 text-amber-300',
    INACTIVE: 'bg-red-500/20 text-red-300',
    ADMIN: 'bg-indigo-500/20 text-indigo-300',
    USER: 'bg-slate-500/20 text-slate-300',
  };

  const badgeClass = `${baseClasses} ${
    status && statusClasses[status as keyof typeof statusClasses]
      ? statusClasses[status as keyof typeof statusClasses]
      : 'bg-slate-500/20 text-slate-300'
  }`;

  return <span className={badgeClass}>{children}</span>;
};