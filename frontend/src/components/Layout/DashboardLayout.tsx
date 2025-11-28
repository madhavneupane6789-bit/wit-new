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
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary">Education Hub</p>
            <h1 className="text-2xl font-semibold text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-white">{user?.name}</p>
              <p className="text-xs text-slate-400">{user?.role}</p>
            </div>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};
