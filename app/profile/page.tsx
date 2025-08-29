'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUserPreferencesStore } from '@/lib/store/user-preferences-store';
import { useUserProfileStore } from '@/lib/store/user-profile-store';
import { LogoutConfirmationModal } from '@/components/ui/logout-confirmation-modal';
import MainNavbar from '@/components/navigation/main-navbar';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { selectedTeams: followedTeams } = useUserPreferencesStore();
  const { 
    profile, 
    isLoading, 
    error, 
    fetchProfile, 
    updateProfile, 
    clearError 
  } = useUserProfileStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check authentication - redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/profile');
      return;
    }

    // Fetch user profile from API
    fetchProfile();
  }, [isAuthenticated, router, fetchProfile]);

  // Update local form state when profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
    }
  }, [profile]);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ fullName });
      setIsEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Error is already handled by the store
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        <MainNavbar />
        <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <MainNavbar />
      
      <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">
        {/* Profile Header */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {profile?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">{profile?.fullName}</h1>
                <p className="text-white/70 text-lg mb-4">{profile?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <div className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium">
                    Member since {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : 'Unknown'}
                  </div>
                  <div className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium">
                    {followedTeams.length} Teams Followed
                  </div>
                </div>
              </div>
              
              {/* Edit Button */}
              {!isEditMode && (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Account Information */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Account Information</h2>
              </div>
              
              {isEditMode ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email}
                      disabled
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60 cursor-not-allowed"
                    />
                    <p className="text-white/50 text-xs mt-2">Email address cannot be changed</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => {
                        setIsEditMode(false);
                        setFullName(profile?.fullName || '');
                      }}
                      className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300 border border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Full Name</span>
                    <span className="text-white font-semibold">{profile?.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Email</span>
                    <span className="text-white font-semibold">{profile?.email}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                    <span className="text-white/70">Member Since</span>
                    <span className="text-white font-semibold">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-GB', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'Unknown'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Followed Teams */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Followed Teams</h2>
              </div>
              
              {followedTeams.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {followedTeams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                      <img 
                        src={team.logo} 
                        alt={team.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-xs">
                        {team.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{team.name}</div>
                        <div className="text-white/60 text-sm">{team.league}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-white/60 mb-4">No teams followed yet</p>
                  <button 
                    onClick={() => router.push('/matches')}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Discover Teams
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="relative group mt-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Account Actions</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
