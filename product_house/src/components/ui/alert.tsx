// src/components/ui/alert.tsx
import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

// Map of variants to Tailwind classes for background and border
const variantClasses: Record<AlertVariant, { bg: string; border: string; icon: JSX.Element }> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    border: 'border-blue-200 dark:border-blue-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
  success: {
    bg: 'bg-success-50 dark:bg-success-900/30',
    border: 'border-success-200 dark:border-success-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-500 dark:text-success-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-warning-50 dark:bg-warning-900/30',
    border: 'border-warning-200 dark:border-warning-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning-500 dark:text-warning-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-error-50 dark:bg-error-900/30',
    border: 'border-error-200 dark:border-error-800',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-500 dark:text-error-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function Alert({
  variant = 'info',
  title,
  icon,
  onClose,
  className = '',
  children,
}: AlertProps) {
  const { bg, border, icon: defaultIcon } = variantClasses[variant];
  
  const baseClasses = 'flex p-4 rounded-lg border animate-fade-in';
  
  const classes = [
    baseClasses,
    bg,
    border,
    className,
  ].join(' ');

  const titleClasses = {
    info: 'text-blue-800 dark:text-blue-300',
    success: 'text-success-800 dark:text-success-300',
    warning: 'text-warning-800 dark:text-warning-300',
    error: 'text-error-800 dark:text-error-300',
  };

  const contentClasses = {
    info: 'text-blue-700 dark:text-blue-200',
    success: 'text-success-700 dark:text-success-200',
    warning: 'text-warning-700 dark:text-warning-200',
    error: 'text-error-700 dark:text-error-200',
  };

  return (
    <div className={classes} role="alert">
      <div className="flex-shrink-0 mr-3">
        {icon || defaultIcon}
      </div>
      
      <div className="flex-1">
        {title && (
          <div className={`font-medium mb-1 ${titleClasses[variant]}`}>
            {title}
          </div>
        )}
        
        <div className={contentClasses[variant]}>
          {children}
        </div>
      </div>
      
      {onClose && (
        <button
          type="button"
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            variant === 'info' ? 'focus:ring-blue-500 bg-blue-100 text-blue-500 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800' :
            variant === 'success' ? 'focus:ring-success-500 bg-success-100 text-success-500 hover:bg-success-200 dark:bg-success-900 dark:text-success-300 dark:hover:bg-success-800' :
            variant === 'warning' ? 'focus:ring-warning-500 bg-warning-100 text-warning-500 hover:bg-warning-200 dark:bg-warning-900 dark:text-warning-300 dark:hover:bg-warning-800' :
            'focus:ring-error-500 bg-error-100 text-error-500 hover:bg-error-200 dark:bg-error-900 dark:text-error-300 dark:hover:bg-error-800'
          }`}
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
          </svg>
        </button>
      )}
    </div>
  );
}