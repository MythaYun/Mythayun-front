'use client';

import { ReactNode } from 'react';
import MainLayout from '@/components/layout/main-layout';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  // Always hide navigation on auth pages
  return (
    <MainLayout noNavigation={true}>
      {children}
    </MainLayout>
  );
}
