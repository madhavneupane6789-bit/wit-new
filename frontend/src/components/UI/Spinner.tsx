import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/15 border-t-white/70" />
  </div>
);
