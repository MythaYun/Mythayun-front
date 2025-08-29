'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMatchDetailsStore } from '@/lib/store/match-details-store';
import MainNavbar from '@/components/navigation/main-navbar';

export default function MatchDetailsPage() {
  const params = useParams();
  const matchId = params.id as string;
  
  const { 
    matchDetails, 
    isLoading, 
    error, 
    fetchMatchDetails, 
    clearMatchDetails 
  } = useMatchDetailsStore();

  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (matchId) {
      fetchMatchDetails(matchId);
    }
    
    return () => {
      clearMatchDetails();
    };
  }, [matchId, fetchMatchDetails, clearMatchDetails]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white/60">Loading match details...</p>
          </div>
        </div>
        <MainNavbar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => fetchMatchDetails(matchId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <MainNavbar />
      </div>
    );
  }

  if (!matchDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white/60">Match not found</p>
          </div>
        </div>
        <MainNavbar />
      </div>
    );
  }

  const tabs = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
    },
    { 
      id: 'stats', 
      label: 'Statistics', 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5,9V21H1V9H5M10,3V21H6V3H10M15,6V21H11V6H15M20,8V21H16V8H20Z"/></svg>
    },
    { 
      id: 'lineups', 
      label: 'Lineups', 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V9C22,10.11 21.11,11 20,11H4C2.89,11 2,10.11 2,9V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4C8.88,4 9.67,4.38 10.18,5H13.82C14.33,4.38 15.12,4 16,4M8,6A1,1 0 0,0 7,7A1,1 0 0,0 8,8A1,1 0 0,0 9,7A1,1 0 0,0 8,6M16,6A1,1 0 0,0 15,7A1,1 0 0,0 16,8A1,1 0 0,0 17,7A1,1 0 0,0 16,6M4,13H20V20C20,21.11 19.11,22 18,22H6C4.89,22 4,21.11 4,20V13Z"/></svg>
    },
    { 
      id: 'stadium', 
      label: 'Stadium', 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75Z"/></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Match Details</h1>
          <p className="text-white/60">{matchDetails.league} • {matchDetails.date}</p>
        </div>

        {/* Match Header */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                {matchDetails.homeTeamLogo ? (
                  <img 
                    src={matchDetails.homeTeamLogo} 
                    alt={matchDetails.homeTeam}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {matchDetails.homeTeam.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg text-center">{matchDetails.homeTeam}</h3>
            </div>

            {/* Score & Status */}
            <div className="flex flex-col items-center mx-8">
              <div className="flex items-center space-x-4 mb-2">
                <span className="text-4xl font-bold text-white">
                  {matchDetails.homeScore ?? '-'}
                </span>
                <span className="text-2xl text-white/60">-</span>
                <span className="text-4xl font-bold text-white">
                  {matchDetails.awayScore ?? '-'}
                </span>
              </div>
              <div className="text-center">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  matchDetails.status === 'live' ? 'bg-red-500/20 text-red-400' :
                  matchDetails.status === 'finished' ? 'bg-green-500/20 text-green-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {matchDetails.status === 'live' ? `LIVE ${matchDetails.time}` :
                   matchDetails.status === 'finished' ? 'FT' :
                   matchDetails.time}
                </div>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                {matchDetails.awayTeamLogo ? (
                  <img 
                    src={matchDetails.awayTeamLogo} 
                    alt={matchDetails.awayTeam}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {matchDetails.awayTeam.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="text-white font-bold text-lg text-center">{matchDetails.awayTeam}</h3>
            </div>
          </div>

          {/* Match Info */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white/60 text-sm">Venue</div>
                <div className="text-white font-medium">{matchDetails.venue}</div>
              </div>
              {matchDetails.referee && (
                <div>
                  <div className="text-white/60 text-sm">Referee</div>
                  <div className="text-white font-medium">{matchDetails.referee}</div>
                </div>
              )}
              {matchDetails.attendance && (
                <div>
                  <div className="text-white/60 text-sm">Attendance</div>
                  <div className="text-white font-medium">{matchDetails.attendance.toLocaleString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Navigation - Mobile Optimized */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2 py-3 px-2 sm:px-4 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center">
                  {tab.id === 'overview' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  )}
                  {tab.id === 'stats' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5,9V21H1V9H5M10,3V21H6V3H10M15,6V21H11V6H15M20,8V21H16V8H20Z"/>
                    </svg>
                  )}
                  {tab.id === 'lineups' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16,4C16.88,4 17.67,4.38 18.18,5H20C21.11,5 22,5.89 22,7V9C22,10.11 21.11,11 20,11H4C2.89,11 2,10.11 2,9V7C2,5.89 2.89,5 4,5H5.82C6.33,4.38 7.12,4 8,4C8.88,4 9.67,4.38 10.18,5H13.82C14.33,4.38 15.12,4 16,4M8,6A1,1 0 0,0 7,7A1,1 0 0,0 8,8A1,1 0 0,0 9,7A1,1 0 0,0 8,6M16,6A1,1 0 0,0 15,7A1,1 0 0,0 16,8A1,1 0 0,0 17,7A1,1 0 0,0 16,6M4,13H20V20C20,21.11 19.11,22 18,22H6C4.89,22 4,21.11 4,20V13Z"/>
                    </svg>
                  )}
                  {tab.id === 'stadium' && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,3L2,12H5V20H19V12H22L12,3M12,8.75A2.25,2.25 0 0,1 14.25,11A2.25,2.25 0 0,1 12,13.25A2.25,2.25 0 0,1 9.75,11A2.25,2.25 0 0,1 12,8.75Z"/>
                    </svg>
                  )}
                </div>
                <span className="font-medium text-xs sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Match Events */}
            {matchDetails.events && matchDetails.events.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <h2 className="text-xl font-bold text-white mb-6">Match Events</h2>
                <div className="space-y-4">
                  {matchDetails.events.map((event, index) => (
                    <div key={`${matchDetails.id}-${event.minute}-${event.type}-${index}`} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                      <div className="text-white/60 text-sm font-medium w-12">
                        {event.minute}'
                      </div>
                      <div className={`w-3 h-3 rounded-full ${
                        event.type === 'GOAL' ? 'bg-green-400' :
                        event.type === 'YELLOW_CARD' ? 'bg-yellow-400' :
                        event.type === 'RED_CARD' ? 'bg-red-400' :
                        'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-white font-medium">
                          {event.type.replace('_', ' ')}
                          {event.player && ` - ${event.player}`}
                        </div>
                        {event.assist && (
                          <div className="text-white/60 text-sm">Assist: {event.assist}</div>
                        )}
                      </div>
                      <div className={`text-sm font-medium ${
                        event.team === 'home' ? 'text-blue-400' : 'text-purple-400'
                      }`}>
                        {event.team === 'home' ? matchDetails.homeTeam : matchDetails.awayTeam}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && matchDetails.statistics && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Statistics</h2>
            
            <div className="space-y-6">
              {/* Possession */}
              {matchDetails.statistics?.possession?.home !== null && matchDetails.statistics?.possession?.away !== null && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-400 font-bold">{matchDetails.statistics?.possession?.home}%</span>
                    <span className="text-white/60 text-sm">Possession</span>
                    <span className="text-purple-400 font-bold">{matchDetails.statistics?.possession?.away}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000"
                      style={{ width: `${matchDetails.statistics?.possession?.home}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Other Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {matchDetails.statistics?.shots?.total?.home !== null && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Shots</div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-bold">{matchDetails.statistics?.shots?.total?.home}</span>
                      <span className="text-purple-400 font-bold">{matchDetails.statistics?.shots?.total?.away}</span>
                    </div>
                  </div>
                )}
                
                {matchDetails.statistics?.corners?.home !== null && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Corners</div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-bold">{matchDetails.statistics?.corners?.home}</span>
                      <span className="text-purple-400 font-bold">{matchDetails.statistics?.corners?.away}</span>
                    </div>
                  </div>
                )}
                
                {matchDetails.statistics?.fouls?.home !== null && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Fouls</div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-bold">{matchDetails.statistics?.fouls?.home}</span>
                      <span className="text-purple-400 font-bold">{matchDetails.statistics?.fouls?.away}</span>
                    </div>
                  </div>
                )}
                
                {matchDetails.statistics?.yellowCards?.home !== null && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Yellow Cards</div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-bold">{matchDetails.statistics?.yellowCards?.home}</span>
                      <span className="text-purple-400 font-bold">{matchDetails.statistics?.yellowCards?.away}</span>
                    </div>
                  </div>
                )}
                
                {matchDetails.statistics?.redCards?.home !== null && (
                  <div className="text-center">
                    <div className="text-white/60 text-sm mb-1">Red Cards</div>
                    <div className="flex justify-between">
                      <span className="text-blue-400 font-bold">{matchDetails.statistics?.redCards?.home}</span>
                      <span className="text-purple-400 font-bold">{matchDetails.statistics?.redCards?.away}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lineups Tab */}
        {activeTab === 'lineups' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Team Lineups</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Home Team Lineup */}
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    {matchDetails.homeTeamLogo ? (
                      <img src={matchDetails.homeTeamLogo} alt={matchDetails.homeTeam} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-white text-sm font-bold">{matchDetails.homeTeam.charAt(0)}</span>
                    )}
                  </div>
                  {matchDetails.homeTeam}
                </h3>
                
                {/* Formation */}
                <div className="mb-4">
                  <span className="text-white/60 text-sm">Formation: </span>
                  <span className="text-white font-medium">4-3-3</span>
                </div>
                
                {/* Starting XI */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm uppercase tracking-wide">Starting XI</h4>
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Player {i + 1}</div>
                        <div className="text-white/60 text-sm">Position</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Away Team Lineup */}
              <div>
                <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                    {matchDetails.awayTeamLogo ? (
                      <img src={matchDetails.awayTeamLogo} alt={matchDetails.awayTeam} className="w-6 h-6 object-contain" />
                    ) : (
                      <span className="text-white text-sm font-bold">{matchDetails.awayTeam.charAt(0)}</span>
                    )}
                  </div>
                  {matchDetails.awayTeam}
                </h3>
                
                {/* Formation */}
                <div className="mb-4">
                  <span className="text-white/60 text-sm">Formation: </span>
                  <span className="text-white font-medium">4-4-2</span>
                </div>
                
                {/* Starting XI */}
                <div className="space-y-2">
                  <h4 className="text-white font-medium text-sm uppercase tracking-wide">Starting XI</h4>
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i} className="flex items-center space-x-3 p-2 bg-white/5 rounded-lg">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">Player {i + 1}</div>
                        <div className="text-white/60 text-sm">Position</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Stadium Tab */}
        {activeTab === 'stadium' && (
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-white/20">
            <h2 className="text-xl font-bold text-white mb-6">Stadium Guide</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Stadium Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Stadium Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-white/60 text-sm sm:text-base">Name:</span>
                      <span className="text-white font-medium text-sm sm:text-base text-right">{matchDetails.venue || 'Stadium Name'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/60 text-sm sm:text-base">Capacity:</span>
                      <span className="text-white font-medium text-sm sm:text-base">75,000</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/60 text-sm sm:text-base">Opened:</span>
                      <span className="text-white font-medium text-sm sm:text-base">2010</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-white/60 text-sm sm:text-base">Surface:</span>
                      <span className="text-white font-medium text-sm sm:text-base">Natural Grass</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Getting There</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Public Transport
                      </h4>
                      <p className="text-white/60 text-sm">Metro Line 2 - Stadium Station (5 min walk)</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                        By Car
                      </h4>
                      <p className="text-white/60 text-sm">Parking available on-site. €10 per vehicle.</p>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                        </svg>
                        Shuttle Bus
                      </h4>
                      <p className="text-white/60 text-sm">Free shuttle from city center on match days.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Stadium Features */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Stadium Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Food Courts',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/></svg>
                      },
                      {
                        name: 'Club Store',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                      },
                      {
                        name: 'Family Areas',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16.5c-.8 0-1.54.5-1.85 1.26l-1.92 5.63c-.15.45.15.95.6 1.05.45.1.95-.15 1.05-.6L15.5 11h1.86L19.5 18H22v2h-2zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.8-.67-1.5-1.5-1.5S6 8.7 6 9.5V15H4v7h3.5z"/></svg>
                      },
                      {
                        name: 'Accessibility',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z"/></svg>
                      },
                      {
                        name: 'Free WiFi',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                      },
                      {
                        name: 'Fan Zone',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                      },
                      {
                        name: 'Medical Center',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
                      },
                      {
                        name: 'Security',
                        icon: <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11C15.4,11 16,11.4 16,12V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V12C8,11.4 8.4,11 9,11V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/></svg>
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                        {feature.icon}
                        <span className="text-sm text-white font-medium">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Match Day Tips</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-500/30">
                      <h4 className="text-blue-400 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
                        </svg>
                        Arrive Early
                      </h4>
                      <p className="text-white/60 text-sm">Gates open 2 hours before kickoff. Arrive early to avoid queues.</p>
                    </div>
                    <div className="p-3 bg-green-600/20 rounded-lg border border-green-500/30">
                      <h4 className="text-green-400 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,6V8H18V6H16M16,10V12H18V10H16M16,14V16H18V14H16M8,6V8H14V6H8M8,10V12H14V10H8M8,14V16H14V14H8Z"/>
                        </svg>
                        Digital Tickets
                      </h4>
                      <p className="text-white/60 text-sm">Download the official app for contactless entry.</p>
                    </div>
                    <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-500/30">
                      <h4 className="text-yellow-400 font-medium mb-1 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M15,13V11A3,3 0 0,0 12,8A3,3 0 0,0 9,11V13A2,2 0 0,0 7,15V19A2,2 0 0,0 9,21H15A2,2 0 0,0 17,19V15A2,2 0 0,0 15,13M12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17M14,13H10V11A2,2 0 0,1 12,9A2,2 0 0,1 14,11M12,3L13.09,8.26L22,9L17,14L18.18,23L12,19.77L5.82,23L7,14L2,9L10.91,8.26L12,3Z"/>
                        </svg>
                        Weather
                      </h4>
                      <p className="text-white/60 text-sm">Check weather conditions and dress appropriately.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <MainNavbar />
    </div>
  );
}
