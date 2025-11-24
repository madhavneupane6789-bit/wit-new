import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const DashboardLayout: React.FC<Props> = ({ title, children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-indigo-50">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/60 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Education Hub</p>
            <h1 className="text-2xl font-semibold text-midnight">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-midnight">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.role}</p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
};
