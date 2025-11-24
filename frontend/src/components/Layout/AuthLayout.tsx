import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export const AuthLayout: React.FC<Props> = ({ title, subtitle, children }) => (
  <div className="flex min-h-screen items-center justify-center px-4 py-10">
    <div className="glass relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/50 p-8 shadow-glow">
      <motion.div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-emerald-400/20 blur-3xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />
      <div className="relative z-10 space-y-2 pb-4">
        <Link to="/" className="text-sm font-semibold text-blue-600">
          ← Back to home
        </Link>
        <h1 className="text-3xl font-bold text-midnight">{title}</h1>
        {subtitle && <p className="text-slate-600">{subtitle}</p>}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  </div>
);
