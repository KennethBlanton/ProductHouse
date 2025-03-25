// src/components/ui/loading.tsx
import React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export default function Loading({ size = 'medium', message = 'Loading...' }: LoadingProps) {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizeClasses[size]} rounded-full border-blue-600 border-t-transparent animate-spin`}
      ></div>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
}