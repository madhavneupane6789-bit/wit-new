import React from 'react';
import clsx from 'clsx';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
};

const base =
  'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className, children, ...rest }) => {
  const styles = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-glow hover:scale-[1.01] focus:ring-blue-200',
    ghost: 'bg-white/70 text-midnight border border-white/60 hover:scale-[1.01]',
    danger: 'bg-rose-500 text-white hover:scale-[1.01] focus:ring-rose-200',
  }[variant];

  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
};
