'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useUserPreferences } from '@/hooks/use-user-preferences';

export default function MainNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedTeams } = useUserPreferences();

  const navigationItems = [
    {
      id: 'matches',
      label: 'Matches',
      path: '/matches',
      icon: (isActive: boolean) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-white/60'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      ),
      mobileIcon: (isActive: boolean) => (
        <svg className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/60'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      path: '/profile',
      icon: (isActive: boolean) => (
        <svg className={`w-6 h-6 ${isActive ? 'text-blue-400' : 'text-white/60'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      ),
      mobileIcon: (isActive: boolean) => (
        <svg className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/60'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      )
    }
  ];

  const isActive = (path: string) => {
    if (path === '/matches') {
      return pathname === '/matches' || pathname.startsWith('/matches/');
    }
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      {/* Desktop Navigation - Top */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50">
        <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  MythaYun
                </div>
                {selectedTeams.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    <span className="text-white/60 text-sm">
                      {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} followed
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <div className="flex items-center space-x-2">
                {navigationItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.path)}
                      className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        active
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.icon(active)}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60]">
        <div className="bg-slate-900/90 backdrop-blur-xl border-t border-white/10">
          <div className="flex items-center justify-around px-4 py-3">
            {navigationItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-300 ${
                    active
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                  }`}
                >
                  {item.mobileIcon(active)}
                  <span className={`text-xs font-medium ${active ? 'text-blue-400' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Spacer for fixed navigation */}
      <div className="hidden md:block h-16"></div>
      <div className="md:hidden h-20"></div>
    </>
  );
}
