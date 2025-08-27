'use client';

import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'flat';
  isInteractive?: boolean;
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className = '',
  variant = 'default',
  isInteractive = false,
  noPadding = false,
  ...props
}, ref) => {
  // Base classes with consistent branding
  const baseClasses = "rounded-lg overflow-hidden transition-all duration-200 ease-out";
  
  // Variant classes with design system tokens
  const variantClasses = {
    default: "border border-gray-200 shadow-card",
    bordered: "border-2 border-primary-500 shadow-card",
    elevated: "shadow-card border border-gray-100",
    flat: "border-0 shadow-none",
  };
  
  // Interactive classes for hover/tap effects
  const interactiveClasses = isInteractive
    ? "cursor-pointer hover:shadow-floating hover:-translate-y-0.5 active:translate-y-0 active:shadow-card"
    : "";
  
  // Padding classes with consistent spacing
  const paddingClasses = noPadding ? "" : "p-4";
  
  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${interactiveClasses} ${paddingClasses} ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      className={`mb-3 flex items-center justify-between ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <h3
      className={`text-lg font-semibold text-gray-900 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(({ 
  children, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <p
      className={`text-sm text-gray-500 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(({ 
  children, 
  className = '', 
  ...props 
}, ref) => {
  return (
    <div
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      className={`mt-4 flex items-center border-t border-gray-100 pt-3 ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';
