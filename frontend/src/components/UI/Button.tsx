import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

const base =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-end';

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...rest }) => {
  const styles = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white shadow-glow hover:scale-[1.02] focus:ring-primary',
    ghost:
      'glass text-white hover:bg-white/10 hover:text-white/80 focus:ring-white/50 border-transparent',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 hover:scale-[1.02] focus:ring-rose-500',
  }[variant];

  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
};
