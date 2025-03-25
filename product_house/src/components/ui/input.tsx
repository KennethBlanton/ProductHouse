// src/components/ui/input.tsx
import React, { forwardRef } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: InputSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
}

// Map of sizes to Tailwind classes
const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-5 py-2.5 text-lg',
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    label,
    helperText,
    error,
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    isLoading = false,
    containerClassName = '',
    labelClassName = '',
    inputClassName = '',
    helperClassName = '',
    errorClassName = '',
    className = '',
    disabled,
    ...props
  }, ref) => {
    const containerClasses = [
      'flex flex-col',
      fullWidth ? 'w-full' : '',
      containerClassName,
    ].join(' ');

    const labelClasses = [
      'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1',
      labelClassName,
    ].join(' ');

    const baseInputClasses = 'block rounded-md shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors';
    
    const stateClasses = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400';
    
    const disabledClasses = disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
      : '';
    
    const inputWrapperClasses = [
      'relative rounded-md shadow-sm',
      fullWidth ? 'w-full' : '',
      inputClassName,
    ].join(' ');

    const inputClasses = [
      baseInputClasses,
      stateClasses,
      sizeClasses[size],
      leftIcon ? 'pl-10' : '',
      rightIcon || isLoading ? 'pr-10' : '',
      disabledClasses,
      className,
    ].join(' ');

    const helperClasses = [
      'mt-1 text-sm text-gray-500 dark:text-gray-400',
      helperClassName,
    ].join(' ');

    const errorClasses = [
      'mt-1 text-sm text-error-600 dark:text-error-400',
      errorClassName,
    ].join(' ');

    return (
      <div className={containerClasses}>
        {label && <label className={labelClasses}>{label}</label>}
        
        <div className={inputWrapperClasses}>
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={inputClasses}
            disabled={disabled || isLoading}
            {...props}
          />
          
          {(rightIcon || isLoading) && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isLoading ? (
                <svg className="animate-spin h-4 w-4 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                rightIcon
              )}
            </div>
          )}
        </div>
        
        {error && <p className={errorClasses}>{error}</p>}
        {helperText && !error && <p className={helperClasses}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
