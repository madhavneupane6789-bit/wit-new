import React from 'react';
import { Spinner } from './Spinner';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  );
};
