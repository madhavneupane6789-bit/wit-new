import React from 'react';

export const Spinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500" />
  </div>
);
