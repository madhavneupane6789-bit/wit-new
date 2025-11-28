import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

const base =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-end relative overflow-hidden';

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...rest }) => {
  const styles = {
    primary:
      'text-white backdrop-blur-md bg-gradient-to-r from-sky-500/75 via-cyan-400/75 to-blue-600/80 ' +
      'border border-white/15 shadow-[0_10px_35px_rgba(59,130,246,0.35)] ' +
      'hover:shadow-[0_14px_45px_rgba(59,130,246,0.45)] hover:-translate-y-[1px] ' +
      'focus:ring-sky-200/80 focus:ring-offset-0',
    ghost:
      'glass text-white hover:bg-white/10 hover:text-white/80 focus:ring-white/50 border border-white/10',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-[1.02] focus:ring-rose-500',
  }[variant];

  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
};
