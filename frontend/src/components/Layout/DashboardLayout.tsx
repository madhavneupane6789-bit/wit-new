import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../UI/Button';
import { ChangePasswordModal } from '../User/ChangePasswordModal';
import { Badge } from '../UI/Badge';

type Props = {
  title: string;
  children: React.ReactNode;
};

const formatDate = (dateString: string | Date | undefined | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const DashboardLayout: React.FC<Props> = ({ title, children }) => {
  const { user, logout, showCookieMessage, dismissCookieMessage } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen">
      <ChangePasswordModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {showCookieMessage && (
        <div className="bg-blue-600 p-3 text-center text-white text-sm flex justify-between items-center">
          <span>Please use your Gmail for cookies to be able to access content properly.</span>
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
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-4 text-right cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
                {user?.avatarUrl && <img src={user.avatarUrl} alt="avatar" className="h-10 w-10 rounded-full object-cover" />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl glass bg-black/70 shadow-lg ring-1 ring-black/30 focus:outline-none z-50">
                  <div className="py-1 px-1">
                    <div className="px-3 py-2">
                      <p className="text-xs uppercase tracking-wider text-slate-400">Account Status</p>
                      <div className="mt-2 space-y-2 text-sm text-white">
                        <div className='flex justify-between items-center'>
                          <span>Status:</span>
                          <Badge status={user?.status}>{user?.status || 'UNKNOWN'}</Badge>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span>Plan:</span>
                          <span className='font-medium'>{user?.subscriptionStatus}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span>Subscribed:</span>
                          <span className='font-medium'>{formatDate(user?.subscriptionStartDate)}</span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span>Expires:</span>
                          <span className='font-medium'>{formatDate(user?.subscriptionEndDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-1 border-t border-white/10" />
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        Change Password
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-sm text-red-400 hover:text-red-300" onClick={logout}>
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
};
