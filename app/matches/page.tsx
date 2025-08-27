'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useMatchesStore } from '@/lib/store/matches-store';
import { useAuthStore } from '@/lib/store/auth-store';
import MainNavbar from '@/components/navigation/main-navbar';

// Mock data removed - now using real API data from matches store

type MatchFilter = 'All' | 'Live' | 'Upcoming' | 'Finished' | 'Followed';
type LeagueFilter = 'All' | 'Premier League' | 'La Liga' | 'Serie A' | 'Bundesliga' | 'Ligue 1';
type DateFilter = 'All' | 'Today' | 'Tomorrow' | 'This Week' | 'Custom';

// Major European leagues configuration
const MAJOR_LEAGUES = [
  { id: 'All', name: 'All Leagues', flag: '🌍' },
  { id: 'Premier League', name: 'Premier League', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: 'La Liga', name: 'La Liga', flag: '🇪🇸' },
  { id: 'Serie A', name: 'Serie A', flag: '🇮🇹' },
  { id: 'Bundesliga', name: 'Bundesliga', flag: '🇩🇪' },
  { id: 'Ligue 1', name: 'Ligue 1', flag: '🇫🇷' },
] as const; 

export default function MatchesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<MatchFilter>('All');
  const [activeLeague, setActiveLeague] = useState<LeagueFilter>('All');
  const [activeDateFilter, setActiveDateFilter] = useState<DateFilter>('All');
  const [customDate, setCustomDate] = useState<string>('');
  
  // User preferences for personalization
  const { 
    selectedTeams, 
    hasSelectedTeams, 
    isTeamFollowed, 
    onboardingCompleted 
  } = useUserPreferences();
  
  // Auth store for authentication status
  const { isAuthenticated } = useAuthStore();
  
  // Matches store for API data
  const { 
    matches, 
    liveMatches, 
    isLoading, 
    error, 
    fetchMatches, 
    fetchLiveMatches, 
    clearError,
    isCacheValid,
    getCacheAge
  } = useMatchesStore();
  
  // Fetch matches on component mount with smart caching
  useEffect(() => {
    fetchMatches(); // Will use cache if valid, or fetch fresh data
  }, [fetchMatches]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLiveMatches();
    }
  }, [isAuthenticated, fetchLiveMatches]);

  // Helper function to check if a date matches the selected date filter
  const matchesDateFilter = (matchDate: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const matchDateObj = new Date(matchDate);
    
    switch (activeDateFilter) {
      case 'Today':
        return matchDateObj.toDateString() === today.toDateString();
      case 'Tomorrow':
        return matchDateObj.toDateString() === tomorrow.toDateString();
      case 'This Week':
        return matchDateObj >= today && matchDateObj <= weekFromNow;
      case 'Custom':
        if (!customDate) return true;
        return matchDateObj.toDateString() === new Date(customDate).toDateString();
      default:
        return true;
    }
  };

  // Filter matches based on user preferences and all active filters
  const getFilteredMatches = () => {
    let filtered = matches.map(match => ({
      ...match,
      isFollowed: isTeamFollowed(match.homeTeam.toLowerCase().replace(' ', '-')) || 
                  isTeamFollowed(match.awayTeam.toLowerCase().replace(' ', '-'))
    }));

    // Apply status filter
    switch (activeFilter) {
      case 'Live':
        filtered = filtered.filter(match => match.status === 'live');
        break;
      case 'Upcoming':
        filtered = filtered.filter(match => match.status === 'upcoming');
        break;
      case 'Finished':
        filtered = filtered.filter(match => match.status === 'finished');
        break;
      case 'Followed':
        filtered = filtered.filter(match => match.isFollowed);
        break;
    }

    // Apply league filter
    if (activeLeague !== 'All') {
      filtered = filtered.filter(match => match.league === activeLeague);
    }

    // Apply date filter
    if (activeDateFilter !== 'All') {
      filtered = filtered.filter(match => matchesDateFilter(match.date));
    }

    return filtered.sort((a, b) => {
      if (a.isFollowed && !b.isFollowed) return -1;
      if (!a.isFollowed && b.isFollowed) return 1;
      const statusPriority = { live: 3, upcoming: 2, finished: 1 };
      return statusPriority[b.status] - statusPriority[a.status];
    });
  };

  const filteredMatches = getFilteredMatches();
  const availableFilters = hasSelectedTeams ? ['All', 'Live', 'Upcoming', 'Finished', 'Followed'] : ['All', 'Live', 'Upcoming', 'Finished'];

  // Handle match card click
  const handleMatchClick = (matchId: string) => {
    router.push(`/matches/${matchId}`);
  };

  // Modern SVG Icons
  const LiveIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" className="animate-pulse" />
      <path d="M12 1v6m0 10v6m11-7h-6m-10 0H1m15.5-6.5l-4.24 4.24M6.74 17.26L2.5 21.5m15-15l-4.24 4.24M6.74 6.74L2.5 2.5" />
    </svg>
  );

  const UpcomingIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );

  const FinishedIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );

  const FollowedIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );

  const AllIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  );

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'Live': return <LiveIcon />;
      case 'Upcoming': return <UpcomingIcon />;
      case 'Finished': return <FinishedIcon />;
      case 'Followed': return <FollowedIcon />;
      default: return <AllIcon />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Navbar */}
      <MainNavbar />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
              Live Matches
            </h1>
            <button
              onClick={() => fetchMatches(true)} // Force refresh
              disabled={isLoading}
              className="group relative p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh matches data"
            >
              <svg 
                className={`w-5 h-5 text-white/70 group-hover:text-white transition-all duration-300 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {/* Cache indicator */}
              {!isLoading && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </div>
          <p className="text-white/70 font-light text-lg">
            Follow your favorite teams and never miss a match
          </p>
          {/* Cache status indicator */}
          {!isLoading && (
            <p className="text-white/50 text-xs mt-2">
              {(() => {
                if (isCacheValid()) {
                  const ageInMinutes = Math.floor((getCacheAge() || 0) / 1000 / 60);
                  return `Data cached • Updated ${ageInMinutes} min ago`;
                }
                return 'Fresh data loaded';
              })()}
            </p>
          )}
        </div>

        {/* Error Display */}
        {error ? (
          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <div>
                    <h3 className="text-red-300 font-semibold text-sm">Error loading matches</h3>
                    <p className="text-red-400/70 text-xs">{error}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    clearError();
                    fetchMatches(true); // Force refresh
                  }}
                  className="text-red-300 hover:text-red-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modern Loading State - Only show during loading */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Loading Matches...</h2>
            <p className="text-white/70">Please wait while we fetch the latest match information.</p>
            
            {/* Loading skeleton cards */}
            <div className="mt-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded w-24"></div>
                        <div className="h-3 bg-white/10 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="h-6 bg-white/10 rounded w-12 mx-auto mb-1"></div>
                      <div className="h-3 bg-white/10 rounded w-8 mx-auto"></div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="space-y-2">
                        <div className="h-4 bg-white/10 rounded w-24"></div>
                        <div className="h-3 bg-white/10 rounded w-16"></div>
                      </div>
                      <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Personalized Header */}
            {hasSelectedTeams && onboardingCompleted && (
          <div className="mb-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-sm">Your Teams</h3>
                    <p className="text-white/70 text-xs">
                      Following {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {selectedTeams.slice(0, 3).map((team) => (
                      <div key={team.id} className="relative">
                        <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center">
                          {team.logo ? (
                            <img 
                              src={team.logo} 
                              alt={team.name}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-white">
                              {team.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {selectedTeams.length > 3 && (
                      <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-white/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-white/70">
                          +{selectedTeams.length - 3}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Filters */}
        <div className="space-y-4 mb-6">
          {/* League Filter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Championship</span>
            </h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {MAJOR_LEAGUES.map((league) => (
                <button
                  key={league.id}
                  onClick={() => setActiveLeague(league.id as LeagueFilter)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeLeague === league.id
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-white/5 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40'
                  }`}
                >
                  <span className="text-sm">{league.flag}</span>
                  <span className="text-xs">{league.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3 flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span>Date</span>
            </h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {(['All', 'Today', 'Tomorrow', 'This Week', 'Custom'] as DateFilter[]).map((dateFilter) => (
                <button
                  key={dateFilter}
                  onClick={() => setActiveDateFilter(dateFilter)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                    activeDateFilter === dateFilter
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/5 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40'
                  }`}
                >
                  <span className="text-xs">{dateFilter}</span>
                </button>
              ))}
            </div>
            
            {/* Custom Date Picker */}
            {activeDateFilter === 'Custom' && (
              <div className="mt-3">
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="Select date"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {availableFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as MatchFilter)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 backdrop-blur-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40'
              }`}
            >
              {getFilterIcon(filter)}
              <span>{filter}</span>
              {filter === 'Followed' && hasSelectedTeams && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {filteredMatches.filter(m => m.isFollowed).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {filteredMatches.length === 0 ? (
            <div className="text-center py-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl px-6 py-8 border border-white/20">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <p className="text-white/70 text-lg mb-2">No matches found</p>
                  <p className="text-white/50 text-sm">
                    {activeFilter === 'Followed' && !hasSelectedTeams
                      ? 'Select your favorite teams in settings to see followed matches'
                      : `No ${activeFilter.toLowerCase()} matches available`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <div key={match.id} className="relative group cursor-pointer" onClick={() => handleMatchClick(match.id)}>
                {/* Highlight followed matches */}
                <div className={`absolute -inset-1 rounded-xl blur-lg transition-opacity duration-300 ${
                  match.isFollowed
                    ? 'bg-gradient-to-r from-green-600/30 to-emerald-600/30 opacity-50 group-hover:opacity-70'
                    : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50'
                }`}></div>
                
                <div className={`relative bg-white/5 backdrop-blur-xl rounded-xl p-4 border transition-all duration-300 hover:scale-[1.02] ${
                  match.isFollowed
                    ? 'border-green-500/30 hover:border-green-500/50'
                    : 'border-white/20 hover:border-white/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {match.isFollowed && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                        <span className="text-white/60 text-sm font-medium">{match.league}</span>
                        <Badge variant={match.status === 'live' ? 'destructive' : 'secondary'} className="flex items-center space-x-1">
                          {match.status === 'live' && <LiveIcon />}
                          <span>{match.status === 'live' ? `LIVE ${match.time}` : match.time}</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-white font-semibold">
                          {match.homeTeam} vs {match.awayTeam}
                        </div>
                        
                        {match.homeScore !== null && match.awayScore !== null && (
                          <div className="text-white font-bold text-lg">
                            {match.homeScore} - {match.awayScore}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
          </>
        )}
      </div>
    </div>
  );
}
