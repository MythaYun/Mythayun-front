'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  // Base classes with enhanced animations
  const baseClasses = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transform hover:-translate-y-0.5 hover:shadow-md active:translate-y-0";
  
  // Size classes
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 h-8",
    md: "text-sm px-4 py-2 h-10",
    lg: "text-base px-6 py-2.5 h-12",
  };
  
  // Variant classes with consistent branding
  const variantClasses = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-subtle",
    secondary: "bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300 border border-secondary-200",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100",
    destructive: "bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-subtle",
    link: "bg-transparent text-primary-600 hover:text-primary-700 hover:underline p-0 h-auto transform-none hover:translate-y-0 hover:shadow-none",
  };
  
  // Loading and disabled classes
  const isDisabled = disabled || isLoading;
  const stateClasses = isDisabled ? "opacity-60 cursor-not-allowed transform-none hover:translate-y-0 hover:shadow-none" : "";
  const widthClasses = isFullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${widthClasses} ${className}`}
      disabled={isDisabled}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      )}
      
      <span className={`flex items-center ${isLoading ? 'opacity-0' : ''}`}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </span>
    </button>
  );
});

Button.displayName = 'Button';
