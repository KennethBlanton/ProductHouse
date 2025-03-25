// src/components/ui/textarea.tsx
import React, { forwardRef } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  helperClassName?: string;
  errorClassName?: string;
  autoResizeHeight?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    helperText,
    error,
    fullWidth = false,
    containerClassName = '',
    labelClassName = '',
    textareaClassName = '',
    helperClassName = '',
    errorClassName = '',
    className = '',
    autoResizeHeight = false,
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

    const baseTextareaClasses = 'block w-full rounded-md shadow-sm focus:ring-2 focus:ring-offset-0 transition-colors';
    
    const stateClasses = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500 dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-400 dark:focus:ring-primary-400';
    
    const disabledClasses = disabled
      ? 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
      : '';
    
    const autoResizeClasses = autoResizeHeight ? 'min-h-[80px] resize-y' : 'resize-none';

    const textareaClasses = [
      baseTextareaClasses,
      stateClasses,
      disabledClasses,
      autoResizeClasses,
      'p-3',
      textareaClassName,
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
        
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          {...props}
        />
        
        {error && <p className={errorClasses}>{error}</p>}
        {helperText && !error && <p className={helperClasses}>{helperText}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
export default TextArea;