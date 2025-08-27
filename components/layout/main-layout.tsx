'use client';

import { ReactNode } from 'react';
import MobileNavigation from './mobile-navigation';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  rightAction?: ReactNode;
  noNavigation?: boolean;
}

export default function MainLayout({
  children,
  title,
  showBackButton = false,
  rightAction,
  noNavigation = false,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header with title and optional back button */}
      {(title || showBackButton || rightAction) && (
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-sm pt-safe">
          <div className="flex h-14 items-center justify-between border-b border-slate-700/50 px-4">
            <div className="flex items-center">
              {showBackButton && (
                <button
                  onClick={() => window.history.back()}
                  className="mr-2 rounded-full p-2 hover:bg-slate-800/50 text-white"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5 8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
              )}
              {title && (
                <h1 className="text-lg font-semibold text-white">{title}</h1>
              )}
            </div>
            {rightAction && <div>{rightAction}</div>}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Mobile navigation */}
      {!noNavigation && <MobileNavigation />}
    </div>
  );
}
