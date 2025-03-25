// src/components/ui/card.tsx
import React from 'react';

type CardVariant = 'default' | 'elevated' | 'outline' | 'filled';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hoverEffect?: boolean;
  animate?: boolean;
}

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

// Map of variants to Tailwind classes
const variantClasses: Record<CardVariant, string> = {
  default: 'border-gray-200 dark:border-gray-700 shadow-sm',
  elevated: 'border-gray-200 dark:border-gray-700 shadow-md',
  outline: 'border-gray-300 dark:border-gray-600',
  filled: 'border-transparent bg-gray-50 dark:bg-gray-800',
};

export function Card({
  variant = 'default',
  className = '',
  children,
  onClick,
  hoverEffect = false,
  animate = false,
  ...props
}: CardProps) {
  const baseClasses = 'bg-white dark:bg-gray-800 border rounded-lg overflow-hidden';
  const hoverClasses = hoverEffect ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1' : '';
  const animateClasses = animate ? 'animate-fade-in animate-slide-up' : '';
  const cursorClasses = onClick ? 'cursor-pointer' : '';
  
  const classes = [
    baseClasses,
    variantClasses[variant],
    hoverClasses,
    animateClasses,
    cursorClasses,
    className,
  ].join(' ');

  return (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = '', children }: CardHeaderProps) {
  const classes = [
    'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
    className,
  ].join(' ');

  return <div className={classes}>{children}</div>;
}

export function CardBody({ className = '', children }: CardBodyProps) {
  const classes = [
    'px-6 py-5',
    className,
  ].join(' ');

  return <div className={classes}>{children}</div>;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  const classes = [
    'px-6 py-4 border-t border-gray-200 dark:border-gray-700',
    className,
  ].join(' ');

  return <div className={classes}>{children}</div>;
}