// src/components/ui/badge.tsx
import React from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

// Map of variants to Tailwind classes
const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-300',
  success: 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-300',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900 dark:text-warning-300',
  error: 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

// Map of sizes to Tailwind classes
const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-base px-3 py-1',
};

export default function Badge({
  variant = 'default',
  size = 'md',
  rounded = false,
  icon,
  className = '',
  children,
}: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    roundedClasses,
    className,
  ].join(' ');

  return (
    <span className={classes}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {children}
    </span>
  );
}