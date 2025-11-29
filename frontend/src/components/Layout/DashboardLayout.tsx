import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';

type Props = {
  title: string;
  children: React.ReactNode;
};

export const DashboardLayout: React.FC<Props> = ({ title, children }) => {
  const { user, logout, showCookieMessage, dismissCookieMessage } = useAuth();

  return (
    <div className="min-h-screen">
      {showCookieMessage && (
        <div className="bg-blue-600 p-3 text-center text-white text-sm flex justify-between items-center">
          <span>
            Please use your Gmail for cookies to be able to access content properly.
          </span>
          <Button onClick={dismissCookieMessage} variant="ghost" className="text-white hover:bg-blue-700">
            Dismiss
          </Button>
        </div>
      )}
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
