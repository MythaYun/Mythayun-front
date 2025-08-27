'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  helperText?: string;
  isFullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  isFullWidth = true,
  disabled,
  id,
  ...props
}, ref) => {
  // Use React's useId for SSR-safe unique IDs
  const reactId = useId();
  const inputId = id ?? reactId;
  
  // Base classes
  const baseClasses = "rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";
  
  // Error, disabled, and width classes
  const errorClasses = error ? "border-error text-error focus:border-error focus:ring-error" : "border-gray-300";
  const disabledClasses = disabled ? "bg-gray-100 cursor-not-allowed opacity-75" : "bg-white";
  const widthClasses = isFullWidth ? "w-full" : "";
  
  // Add padding for icons
  const leftPadding = leftIcon ? "pl-10" : "";
  const rightPadding = rightIcon ? "pr-10" : "";
  
  return (
    <div className={`${isFullWidth ? 'w-full' : ''} mb-4`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block mb-1 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input field */}
        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          className={`${baseClasses} ${errorClasses} ${disabledClasses} ${widthClasses} ${leftPadding} ${rightPadding} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        
        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-xs text-error"
        >
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-xs text-gray-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
