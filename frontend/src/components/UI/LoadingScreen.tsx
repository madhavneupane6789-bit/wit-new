import React from 'react';
import { Spinner } from './Spinner';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-slate-200">
      <Spinner />
      <p className="text-sm text-center text-white/70">
        Warming up the server — this can take a moment on first load. Thanks for waiting.
      </p>
    </div>
  );
};
