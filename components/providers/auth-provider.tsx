'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface AuthProviderProps {
  children: React.ReactNode;
}

// Routes that require authentication
const protectedRoutes = ['/profile', '/follows', '/admin'];
// Routes that require admin access
const adminRoutes = ['/admin'];
// Routes that are only for non-authenticated users
const authRoutes = ['/auth/login', '/auth/register'];
// Routes that are allowed for authenticated users during onboarding
const onboardingRoutes = ['/auth/onboarding'];

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, isAdmin, user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if route requires authentication
    const requiresAuth = protectedRoutes.some(route => pathname.startsWith(route));
    // Check if route requires admin access
    const requiresAdmin = adminRoutes.some(route => pathname.startsWith(route));
    // Check if route is only for non-authenticated users
    const authOnlyRoute = authRoutes.some(route => pathname === route);
    // Check if route is an onboarding route (allowed for authenticated users)
    const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route));

    if (requiresAuth && !isAuthenticated) {
      // Redirect to login if route requires authentication but user is not authenticated
      router.push('/auth/login');
    } else if (requiresAdmin && !isAdmin) {
      // Redirect to home if route requires admin access but user is not an admin
      router.push('/');
    } else if (authOnlyRoute && isAuthenticated) {
      // Redirect to home if route is only for non-authenticated users but user is authenticated
      router.push('/');
    }
    // Note: onboarding routes are allowed for authenticated users, so no redirect needed
  }, [pathname, isAuthenticated, isAdmin, router]);

  return <>{children}</>;
}
