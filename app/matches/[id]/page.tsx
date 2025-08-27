'use client';

import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserPreferences } from '@/hooks/use-user-preferences';
import { useMatchDetailsStore } from '@/lib/store/match-details-store';
import MainNavbar from '@/components/navigation/main-navbar';

// Default fallback values for data not available in Football API
const defaultValues = {
  stadium: {
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    architect: 'Information not available',
    cost: 'Information not available',
    nickname: 'Stadium',
    capacity: null,
    opened: null
  },
  weather: {
    temperature: null,
    condition: 'Information not available',
    humidity: null,
    windSpeed: null
  },
  stats: {
    possession: { home: null, away: null },
    shots: {
      home: { total: null, onTarget: null, offTarget: null, blocked: null },
      away: { total: null, onTarget: null, offTarget: null, blocked: null }
    },
    corners: { home: null, away: null },
    fouls: { home: null, away: null },
    yellowCards: { home: null, away: null },
    redCards: { home: null, away: null },
    offsides: { home: null, away: null },
    passes: {
      home: { total: null, accurate: null, percentage: null },
      away: { total: null, accurate: null, percentage: null }
    },
    saves: { home: null, away: null }
  }
};

type TabType = 'overview' | 'stats' | 'lineups' | 'stadium';

export default function MatchDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const matchId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  // User preferences for personalization
  const { isTeamFollowed } = useUserPreferences();
  
  // Match details store
  const { matchDetails, isLoading, error, fetchMatchDetails, clearMatchDetails } = useMatchDetailsStore();
  
  // Fetch match details on component mount
  useEffect(() => {
    if (matchId) {
      fetchMatchDetails(matchId);
    }
    
    // Cleanup on unmount
    return () => {
      clearMatchDetails();
    };
  }, [matchId, fetchMatchDetails, clearMatchDetails]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <MainNavbar />
        <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Loading Match Details...</h2>
            <p className="text-white/70">Please wait while we fetch the latest match information.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <MainNavbar />
        <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Error Loading Match</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <button
              onClick={() => fetchMatchDetails(matchId)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // No match data
  if (!matchDetails) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <MainNavbar />
        <div className="relative z-10 container mx-auto px-4 py-8 md:pt-8 pt-4 pb-24 md:pb-8">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white/60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">Match Not Found</h2>
            <p className="text-white/70 mb-6">The requested match could not be found.</p>
            <button
              onClick={() => router.push('/matches')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Back to Matches
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Use match details from API with comprehensive fallback data
  // Use real API data from backend, with intelligent fallbacks for unavailable data
  const match = useMemo(() => {
    if (!matchDetails) return null;

    // Cast to any for legacy compatibility during refactor
    const legacyMatch = matchDetails as any;

    // Default values for missing data
    const defaultValues = {
      stadium: {
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
        architect: 'Information not available',
        cost: 'Information not available',
        nickname: 'Stadium',
        capacity: null,
        opened: null
      },
      weather: {
        temperature: null,
        condition: 'Information not available',
        humidity: null,
        windSpeed: null
      },
      stats: {
        possession: { home: null, away: null },
        shots: {
          home: { total: null, onTarget: null, offTarget: null, blocked: null },
          away: { total: null, onTarget: null, offTarget: null, blocked: null }
        },
        corners: { home: null, away: null },
        fouls: { home: null, away: null },
        yellowCards: { home: null, away: null },
        redCards: { home: null, away: null },
        offsides: { home: null, away: null },
        passes: {
          home: { total: null, accurate: null, percentage: null },
          away: { total: null, accurate: null, percentage: null }
        },
        saves: { home: null, away: null }
      }
    };

    return {
      ...matchDetails,
      // Stadium data: Use real venue data from Football API when available
      stadium: {
        name: legacyMatch.venue?.name || matchDetails.stadium?.name || 'Stadium',
        location: legacyMatch.venue?.city || matchDetails.stadium?.location || 'Location not available',
        capacity: matchDetails.stadium?.capacity || defaultValues.stadium.capacity,
        image: matchDetails.stadium?.image || defaultValues.stadium.image,
        architect: matchDetails.stadium?.architect || defaultValues.stadium.architect,
        cost: matchDetails.stadium?.cost || defaultValues.stadium.cost,
        nickname: matchDetails.stadium?.nickname || defaultValues.stadium.nickname,
        opened: matchDetails.stadium?.opened || defaultValues.stadium.opened
      },
      // Weather data: Not available in Football API, show as unavailable
      weather: matchDetails.weather || defaultValues.weather,
      // Events: Use real match events from Football API
      events: matchDetails.events || [],
      // Stats: Now available from advanced Football API integration
      stats: {
        possession: matchDetails.statistics?.possession || defaultValues.stats.possession,
        shots: matchDetails.statistics?.shots || defaultValues.stats.shots,
        corners: matchDetails.statistics?.corners || defaultValues.stats.corners,
        fouls: matchDetails.statistics?.fouls || defaultValues.stats.fouls,
        yellowCards: matchDetails.statistics?.yellowCards || defaultValues.stats.yellowCards,
        redCards: matchDetails.statistics?.redCards || defaultValues.stats.redCards,
        offsides: matchDetails.statistics?.offsides || defaultValues.stats.offsides,
        passes: matchDetails.statistics?.passes || defaultValues.stats.passes,
        saves: matchDetails.statistics?.saves || defaultValues.stats.saves
      },
      lineups: matchDetails.lineups || {
        home: { formation: '4-4-2', players: [] },
        away: { formation: '4-4-2', players: [] }
      },
      attendance: matchDetails.attendance || 0,
      referee: matchDetails.referee || 'Unknown'
    };
  }, [matchDetails]);

  if (!match) {
    return <div>Loading...</div>;
  }
  
  // Cast to any for quick build fix
  const anyMatch = match as any;
  
  // Check if teams are followed
  const isHomeTeamFollowed = isTeamFollowed(anyMatch.homeTeam?.name || '');
  const isAwayTeamFollowed = isTeamFollowed(anyMatch.awayTeam?.name || '');

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
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 md:pt-8 pb-24 md:pb-8">
        
        {/* Match Header */}
        <div className="relative group mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
          <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            
            {/* Match Status and Info */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  match.status === 'live' ? 'bg-red-500' : 
                  match.status === 'finished' ? 'bg-gray-400' : 'bg-green-500'
                }`}></div>
                <span className="text-white/80 font-medium">
                  {match.status === 'live' ? `LIVE ${match.time}` :
                   match.status === 'finished' ? 'FULL TIME' : 
                   match.time}
                </span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">{match.league}</span>
                <span className="text-white/60">•</span>
                <span className="text-white/60">{match.stadium.name}</span>
              </div>
            </div>
            
            {/* Teams and Score */}
            <div className="flex items-center justify-between">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div className={`relative w-20 h-20 mb-4 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 ${
                  isHomeTeamFollowed ? 'ring-4 ring-green-400/50' : ''
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                  <img 
                    src={match.homeTeam.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.homeTeam.name)}&background=3b82f6&color=fff&size=80`} 
                    alt={match.homeTeam.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                    {match.homeTeam.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg text-center mb-1">{match.homeTeam.name}</h3>
                {isHomeTeamFollowed && (
                  <div className="flex items-center space-x-1 text-green-400 text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Following</span>
                  </div>
                )}
              </div>
              
              {/* Score */}
              <div className="flex flex-col items-center px-8">
                <div className="flex items-center space-x-4 mb-2">
                  <div className={`text-5xl font-black transition-colors duration-300 ${
                    match.status === 'live' ? 'text-red-400' : 'text-white'
                  }`}>
                    {match.homeTeam.score}
                  </div>
                  <div className="text-3xl font-light text-white/60">-</div>
                  <div className={`text-5xl font-black transition-colors duration-300 ${
                    match.status === 'live' ? 'text-red-400' : 'text-white'
                  }`}>
                    {match.awayTeam.score}
                  </div>
                </div>
                {match.status === 'live' && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm font-medium">LIVE</span>
                  </div>
                )}
              </div>
              
              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div className={`relative w-20 h-20 mb-4 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 ${
                  isAwayTeamFollowed ? 'ring-4 ring-green-400/50' : ''
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                  <img 
                    src={match.awayTeam.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.awayTeam.name)}&background=8b5cf6&color=fff&size=80`} 
                    alt={match.awayTeam.name}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl">
                    {match.awayTeam.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg text-center mb-1">{match.awayTeam.name}</h3>
                {isAwayTeamFollowed && (
                  <div className="flex items-center space-x-1 text-green-400 text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span>Following</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Weather Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  {match.weather.temperature !== null ? (
                    <>
                      <div className="text-white font-semibold">{match.weather.temperature}°C</div>
                      <div className="text-white/60 text-sm">{match.weather.condition}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-white/60 text-sm">Weather data</div>
                      <div className="text-white/40 text-xs">Not available</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Referee Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">Referee</div>
                  <div className="text-white/60 text-sm">{match.referee}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-white font-semibold">{match.attendance.toLocaleString()}</div>
                  <div className="text-white/60 text-sm">Attendance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 p-1 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20">
          {[
            { 
              id: 'overview', 
              label: 'Overview', 
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )
            },
            { 
              id: 'stats', 
              label: 'Statistics', 
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              )
            },
            { 
              id: 'lineups', 
              label: 'Lineups', 
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10l-1.99-1.01A2.5 2.5 0 0 0 10 8H8.46c-.8 0-1.54.37-2.01.99L3.91 14H6.5v6H9v-7.5h1.5v7.5H13v-6h1.5v6H17zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5z"/>
                </svg>
              )
            },
            { 
              id: 'stadium', 
              label: 'Stadium Guide', 
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              )
            }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Match Events Timeline */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-6">Match Events</h3>
                  <div className="space-y-4">
                    {match.events.map((event, index) => (
                      <div key={`${event.id}-${index}`} className="flex items-center space-x-4 group/event">
                        <div className="flex flex-col items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {event.minute}'
                          </div>
                          {index < match.events.length - 1 && (
                            <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 bg-white/5 rounded-lg p-4 group-hover/event:bg-white/10 transition-colors duration-300">
                          <div className="flex items-center space-x-3">
                            {event.type === 'goal' && (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                </svg>
                              </div>
                            )}
                            {event.type === 'yellow_card' && (
                              <div className="w-6 h-8 bg-yellow-400 rounded-sm"></div>
                            )}
                            <div>
                              <div className="text-white font-semibold">{event.player}</div>
                              {event.assist && (
                                <div className="text-white/60 text-sm">Assist: {event.assist}</div>
                              )}
                              <div className="text-white/60 text-xs capitalize">
                                {event.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                    <h4 className="text-white font-semibold mb-4">Possession</h4>
                    {match.stats.possession.home !== null && match.stats.possession.away !== null ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-blue-400 font-bold">{match.stats.possession.home}%</span>
                          <span className="text-purple-400 font-bold">{match.stats.possession.away}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                            style={{ width: `${match.stats.possession.home}%` }}
                          ></div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-white/60 text-sm">Data not available</div>
                        <div className="text-white/40 text-xs mt-1">Not provided by Football API</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                    <h4 className="text-white font-semibold mb-4">Shots</h4>
                    {match.stats.shots.home.total !== null && match.stats.shots.away.total !== null ? (
                      <>
                        <div className="space-y-3">
                          {/* Total Shots */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-blue-400 font-bold">{match.stats.shots.home.total}</span>
                              <span className="text-white/60 text-sm">Total Shots</span>
                              <span className="text-purple-400 font-bold">{match.stats.shots.away.total}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                                  style={{ width: `${(match.stats.shots.home.total + match.stats.shots.away.total) > 0 ? (match.stats.shots.home.total / (match.stats.shots.home.total + match.stats.shots.away.total)) * 100 : 50}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          {/* On Target */}
                          {match.stats.shots.home.onTarget !== null && match.stats.shots.away.onTarget !== null && (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-blue-300 text-sm">{match.stats.shots.home.onTarget}</span>
                                <span className="text-white/50 text-xs">On Target</span>
                                <span className="text-purple-300 text-sm">{match.stats.shots.away.onTarget}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-1000"
                                    style={{ width: `${(match.stats.shots.home.onTarget + match.stats.shots.away.onTarget) > 0 ? (match.stats.shots.home.onTarget / (match.stats.shots.home.onTarget + match.stats.shots.away.onTarget)) * 100 : 50}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="text-white/60 text-sm">Shot statistics available</div>
                        <div className="text-white/40 text-xs mt-1">Provided by advanced Football API</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Stats */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-xl mb-6">Advanced Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Passes Statistics */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Passes
                      </h4>
                      {match.stats.passes.home.total !== null && match.stats.passes.away.total !== null ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.passes.home.total}</span>
                            <span className="text-white/60">Total</span>
                            <span className="text-purple-400">{match.stats.passes.away.total}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-300">{match.stats.passes.home.accurate}</span>
                            <span className="text-white/60">Accurate</span>
                            <span className="text-purple-300">{match.stats.passes.away.accurate}</span>
                          </div>
                          {match.stats.passes.home.percentage !== null && (
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-200">{match.stats.passes.home.percentage}%</span>
                              <span className="text-white/60">Accuracy</span>
                              <span className="text-purple-200">{match.stats.passes.away.percentage}%</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-white/60 text-sm">Pass statistics available</div>
                      )}
                    </div>

                    {/* Cards Statistics */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                        Cards
                      </h4>
                      <div className="space-y-2">
                        {match.stats.yellowCards.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.yellowCards.home}</span>
                            <span className="text-yellow-400">Yellow Cards</span>
                            <span className="text-purple-400">{match.stats.yellowCards.away}</span>
                          </div>
                        )}
                        {match.stats.redCards.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.redCards.home}</span>
                            <span className="text-red-400">Red Cards</span>
                            <span className="text-purple-400">{match.stats.redCards.away}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Other Statistics */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3">Other Stats</h4>
                      <div className="space-y-2">
                        {match.stats.corners.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.corners.home}</span>
                            <span className="text-white/60">Corners</span>
                            <span className="text-purple-400">{match.stats.corners.away}</span>
                          </div>
                        )}
                        {match.stats.fouls.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.fouls.home}</span>
                            <span className="text-white/60">Fouls</span>
                            <span className="text-purple-400">{match.stats.fouls.away}</span>
                          </div>
                        )}
                        {match.stats.offsides.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.offsides.home}</span>
                            <span className="text-white/60">Offsides</span>
                            <span className="text-purple-400">{match.stats.offsides.away}</span>
                          </div>
                        )}
                        {match.stats.saves && match.stats.saves.home !== null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.saves.home}</span>
                            <span className="text-white/60">Saves</span>
                            <span className="text-purple-400">{match.stats.saves.away}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Shot Breakdown */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        Shot Breakdown
                      </h4>
                      {match.stats.shots.home.total !== null ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.shots.home.onTarget}</span>
                            <span className="text-green-400">On Target</span>
                            <span className="text-purple-400">{match.stats.shots.away.onTarget}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.shots.home.offTarget}</span>
                            <span className="text-orange-400">Off Target</span>
                            <span className="text-purple-400">{match.stats.shots.away.offTarget}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-400">{match.stats.shots.home.blocked}</span>
                            <span className="text-red-400">Blocked</span>
                            <span className="text-purple-400">{match.stats.shots.away.blocked}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-white/60 text-sm">Shot breakdown available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-lg mb-4">{match.homeTeam.name} ({match.lineups.home.formation})</h3>
                  <div className="space-y-3">
                    {match.lineups.home.players.map((player) => (
                      <div key={player.number} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {player.number}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-white/60 text-sm">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-lg mb-4">{match.awayTeam.name} ({match.lineups.away.formation})</h3>
                  <div className="space-y-3">
                    {match.lineups.away.players.map((player) => (
                      <div key={player.number} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-300">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {player.number}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{player.name}</div>
                          <div className="text-white/60 text-sm">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stadium' && (
            <div className="space-y-6">
              {/* Stadium Hero Image */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/20">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={match.stadium.image} 
                      alt={match.stadium.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-white text-2xl font-bold">{match.stadium.name}</h2>
                      <p className="text-white/80">{match.stadium.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stadium Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                    <h3 className="text-white font-bold text-lg mb-4">Stadium Information</h3>
                    <div className="space-y-3">
                      {match.stadium?.capacity && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Capacity:</span>
                          <span className="text-white font-semibold">{match.stadium.capacity.toLocaleString()}</span>
                        </div>
                      )}
                      {match.stadium?.opened && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Opened:</span>
                          <span className="text-white font-semibold">{match.stadium.opened}</span>
                        </div>
                      )}
                      {match.stadium?.architect && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Architect:</span>
                          <span className="text-white font-semibold">{match.stadium.architect}</span>
                        </div>
                      )}
                      {match.stadium?.cost && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Construction Cost:</span>
                          <span className="text-white font-semibold">{match.stadium.cost}</span>
                        </div>
                      )}
                      {match.stadium?.nickname && (
                        <div className="flex justify-between">
                          <span className="text-white/60">Nickname:</span>
                          <span className="text-white font-semibold">{match.stadium.nickname}</span>
                        </div>
                      )}
                      {!match.stadium?.capacity && !match.stadium?.opened && !match.stadium?.architect && !match.stadium?.cost && !match.stadium?.nickname && (
                        <div className="text-white/60 text-center py-4">
                          Stadium information not available
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                    <h3 className="text-white font-bold text-lg mb-4">Match Day Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="text-white/80">{/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg> */}</div>
                        <span className="text-white font-semibold">{new Date(match.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Kick-off:</span>
                        <span className="text-white font-semibold">{match.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Competition:</span>
                        <span className="text-white font-semibold">{match.league}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Weather:</span>
                        <span className="text-white font-semibold">
                          {match.weather.temperature !== null ? 
                            `${match.weather.temperature}°C, ${match.weather.condition}` : 
                            'Not available'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Expected Attendance:</span>
                        <span className="text-white font-semibold">{match.attendance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stadium Description */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                  <h3 className="text-white font-bold text-lg mb-4">About {match.stadium?.name || 'Stadium'}</h3>
                  <p className="text-white/80 leading-relaxed">
                    {match.stadium?.name || 'This stadium'} is the home stadium of {match.homeTeam.name}
                    {match.stadium?.location && `, located in ${match.stadium.location}`}. 
                    {match.stadium?.opened && `Opened in ${match.stadium.opened}, `}
                    {match.stadium?.architect && `this magnificent stadium was designed by ${match.stadium.architect} `}
                    {match.stadium?.cost && `at a construction cost of ${match.stadium.cost}. `}
                    {match.stadium?.capacity && `With a capacity of ${match.stadium.capacity.toLocaleString()} spectators, `}
                    {match.stadium?.nickname && `it's known affectionately as "${match.stadium.nickname}" by fans and `}
                    it has become an iconic venue in world football.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
