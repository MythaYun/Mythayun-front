'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export function MobileNavigation() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin } = useAuthStore();
  
  const navItems: NavItem[] = [
    {
      label: 'Matches',
      href: '/',
      icon: <HomeIcon className="w-6 h-6" />,
      activeIcon: <HomeIconSolid className="w-6 h-6" />,
    },
    {
      label: 'Live',
      href: '/matches/live',
      icon: <LiveIcon className="w-6 h-6" />,
      activeIcon: <LiveIconSolid className="w-6 h-6" />,
    },
    {
      label: 'Follows',
      href: '/follows',
      icon: <StarIcon className="w-6 h-6" />,
      activeIcon: <StarIconSolid className="w-6 h-6" />,
      requiresAuth: true,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: <UserIcon className="w-6 h-6" />,
      activeIcon: <UserIconSolid className="w-6 h-6" />,
    },
    {
      label: 'Admin',
      href: '/admin',
      icon: <GearIcon className="w-6 h-6" />,
      activeIcon: <GearIconSolid className="w-6 h-6" />,
      requiresAuth: true,
      requiresAdmin: true,
    },
  ];
  
  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) return false;
    if (item.requiresAdmin && !isAdmin) return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white py-2 px-4 flex justify-around items-center">
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 px-3 ${
              isActive ? 'text-primary-600' : 'text-gray-500'
            }`}
          >
            <div className="h-6">{isActive ? item.activeIcon : item.icon}</div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

// Icon components (placeholder) - Replace with your preferred icon set
function HomeIcon(props: any) { return <div {...props}>🏠</div>; }
function HomeIconSolid(props: any) { return <div {...props}>🏠</div>; }
function LiveIcon(props: any) { return <div {...props}>📱</div>; }
function LiveIconSolid(props: any) { return <div {...props}>📱</div>; }
function StarIcon(props: any) { return <div {...props}>⭐</div>; }
function StarIconSolid(props: any) { return <div {...props}>⭐</div>; }
function UserIcon(props: any) { return <div {...props}>👤</div>; }
function UserIconSolid(props: any) { return <div {...props}>👤</div>; }
function GearIcon(props: any) { return <div {...props}>⚙️</div>; }
function GearIconSolid(props: any) { return <div {...props}>⚙️</div>; }
