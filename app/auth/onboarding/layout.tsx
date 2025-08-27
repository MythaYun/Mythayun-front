'use client';

import { ReactNode } from 'react';
import MainLayout from '@/components/layout/main-layout';

interface OnboardingLayoutProps {
  children: ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  // Always hide navigation on onboarding pages
  return (
    <MainLayout noNavigation={true}>
      {children}
    </MainLayout>
  );
}
