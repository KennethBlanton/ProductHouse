// src/components/ui/error.tsx
import React from 'react';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export default function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
      <div className="flex items-start">
        <svg
          className="h-5 w-5 text-red-500 mr-2 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}