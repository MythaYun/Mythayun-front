'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUserPreferencesStore, type Team } from '@/lib/store/user-preferences-store';
// Removed CheckCircle import to fix compilation issues

type OnboardingStep = 'welcome' | 'teams' | 'notifications' | 'complete';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);
  const [customTeam, setCustomTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // User preferences store
  const { 
    setSelectedTeams: saveSelectedTeams, 
    setNotificationsEnabled, 
    setOnboardingCompleted,
    notificationsEnabled 
  } = useUserPreferencesStore();

  // Component initialization
  React.useEffect(() => {
    // Onboarding page loaded successfully
  }, []);

  // Navigate to next step
  const nextStep = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('teams');
        break;
      case 'teams':
        // Save selected teams when moving from teams step
        const teamsToSave: Team[] = selectedTeams.map(teamId => {
          // Find team in leagues
          for (const league of leagues) {
            const team = league.teams.find(t => t.id === teamId);
            if (team) {
              return {
                id: team.id,
                name: team.name,
                logo: team.logo,
                league: league.name,
                isCustom: false
              };
            }
          }
          // Custom team
          return {
            id: teamId,
            name: teamId,
            isCustom: true
          };
        });
        saveSelectedTeams(teamsToSave);
        setCurrentStep('notifications');
        break;
      case 'notifications':
        // Save notifications preference
        setNotificationsEnabled(notificationsEnabled);
        setCurrentStep('complete');
        break;
      case 'complete':
        // Complete onboarding and redirect to matches page
        setOnboardingCompleted(true);
        router.replace('/matches');
        break;
    }
  };

  // Render the welcome step
  const renderWelcomeStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-4">
          Welcome to MythaYun!
        </h1>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-transparent rounded-full"></div>
        </div>
        <p className="text-white/70 font-light text-lg">
          Let's set up your account to get the best football experience
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-cyan-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
            <div className="absolute inset-2 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
          </div>
        </div>
        
        {user && (
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 backdrop-blur-sm rounded-xl px-6 py-3 border border-white/10">
              <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-emerald-200">
                Hi, {user.fullName}! 👋
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
        <Button 
          onClick={nextStep} 
          className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl border-0 transition-all duration-500 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center space-x-2">
            <span>Get Started</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '50ms'}}></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '100ms'}}></div>
            </div>
          </div>
        </Button>
      </div>
    </>
  );

  // Mock data for popular leagues and their teams
  const leagues = [
    {
      id: 'premier-league',
      name: 'Premier League',
      country: 'England',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Premier-League-Logo.png',
      teams: [
        { id: 'arsenal', name: 'Arsenal', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png' },
        { id: 'chelsea', name: 'Chelsea', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png' },
        { id: 'man-city', name: 'Manchester City', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png' },
        { id: 'liverpool', name: 'Liverpool', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png' },
        { id: 'man-united', name: 'Manchester United', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png' },
      ]
    },
    {
      id: 'la-liga',
      name: 'La Liga',
      country: 'Spain',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/La-Liga-Logo.png',
      teams: [
        { id: 'real-madrid', name: 'Real Madrid', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png' },
        { id: 'barcelona', name: 'Barcelona', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png' },
        { id: 'atletico', name: 'Atletico Madrid', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Atletico-Madrid-Logo.png' },
        { id: 'sevilla', name: 'Sevilla', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png' },
        { id: 'valencia', name: 'Valencia', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Valencia-Logo.png' },
      ]
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: 'Germany',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Bundesliga-Logo.png',
      teams: [
        { id: 'bayern', name: 'Bayern Munich', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png' },
        { id: 'dortmund', name: 'Borussia Dortmund', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png' },
        { id: 'leipzig', name: 'RB Leipzig', logo: 'https://logos-world.net/wp-content/uploads/2020/06/RB-Leipzig-Logo.png' },
        { id: 'leverkusen', name: 'Bayer Leverkusen', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Bayer-Leverkusen-Logo.png' },
        { id: 'frankfurt', name: 'Eintracht Frankfurt', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Eintracht-Frankfurt-Logo.png' },
      ]
    },
    {
      id: 'ligue-1',
      name: 'Ligue 1',
      country: 'France',
      logo: 'https://logos-world.net/wp-content/uploads/2020/06/Ligue-1-Logo.png',
      teams: [
        { id: 'psg', name: 'Paris Saint-Germain', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png' },
        { id: 'marseille', name: 'Olympique Marseille', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Marseille-Logo.png' },
        { id: 'lyon', name: 'Olympique Lyon', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Lyon-Logo.png' },
        { id: 'monaco', name: 'AS Monaco', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Monaco-Logo.png' },
        { id: 'lille', name: 'Lille OSC', logo: 'https://logos-world.net/wp-content/uploads/2020/06/Lille-Logo.png' },
      ]
    }
  ];



  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const addCustomTeam = () => {
    if (customTeam.trim() && !selectedTeams.includes(customTeam)) {
      setSelectedTeams(prev => [...prev, customTeam.trim()]);
      setCustomTeam('');
    }
  };

  const getSelectedLeagueTeams = () => {
    if (!selectedLeague) return [];
    const league = leagues.find(l => l.id === selectedLeague);
    return league ? league.teams : [];
  };

  // Render the teams step with interactive selection
  const renderTeamsStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-4">
          Select Your Favorite Teams
        </h1>
        <p className="text-white/70 font-light text-lg">
          We'll send you updates on matches and news for teams you follow
        </p>
      </div>

      {/* Selection Counter */}
      <div className="relative group mb-6">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-white/5 backdrop-blur-xl rounded-xl px-4 py-3 border border-white/20 text-center">
          <p className="text-white/90 font-medium">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-bold text-lg">
              {selectedTeams.length}
            </span>
            <span className="text-white/70 ml-2">
              team{selectedTeams.length !== 1 ? 's' : ''} selected
            </span>
          </p>
        </div>
      </div>

      {/* League Selection - Only show when no league is selected */}
      {!selectedLeague && (
        <div className="mb-6">
          <h3 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Select a Championship</h3>
          <div className="grid grid-cols-1 gap-3">
            {leagues.map((league) => (
              <div key={league.id} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <button
                  onClick={() => setSelectedLeague(league.id)}
                  className="relative w-full p-4 rounded-xl border transition-all duration-300 bg-white/5 backdrop-blur-xl border-white/20 hover:border-white/40 text-white/80 hover:text-white"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                      <img 
                        src={league.logo} 
                        alt={league.name}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-sm">
                        {league.name.charAt(0)}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">{league.name}</div>
                      <div className="text-sm text-white/60">{league.country}</div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams from Selected League - Show when league is selected */}
      {selectedLeague && (
        <div className="mb-6">
          {/* Back button and league header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider">
              {leagues.find(l => l.id === selectedLeague)?.name} Teams
            </h3>
            <button
              onClick={() => setSelectedLeague(null)}
              className="flex items-center space-x-2 px-3 py-2 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-lg text-white/70 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
              </svg>
              <span className="text-sm">Change League</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {getSelectedLeagueTeams().map((team) => {
              const isSelected = selectedTeams.includes(team.id);
              return (
                <div key={team.id} className="relative group">
                  <div className={`absolute -inset-1 rounded-xl blur-lg transition-opacity duration-300 ${
                    isSelected 
                      ? 'bg-gradient-to-r from-green-600/40 to-emerald-600/40 opacity-60' 
                      : 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-50'
                  }`}></div>
                  <button
                    onClick={() => toggleTeamSelection(team.id)}
                    className={`relative w-full p-3 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-green-500/20 border-green-500/50 text-white'
                        : 'bg-white/5 backdrop-blur-xl border-white/20 hover:border-white/40 text-white/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img 
                          src={team.logo} 
                          alt={team.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center text-white font-bold text-xs">
                          {team.name.charAt(0)}
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-sm">{team.name}</div>
                      </div>
                      {isSelected && (
                        <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Custom Team */}
      <div className="mb-6">
        <h3 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Add Custom Team</h3>
        <div className="flex space-x-3">
          <div className="relative group flex-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <input
              type="text"
              placeholder="Enter team name..."
              value={customTeam}
              onChange={(e) => setCustomTeam(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomTeam()}
              className="relative w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <button
            onClick={addCustomTeam}
            disabled={!customTeam.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Add
          </button>
        </div>
      </div>

      {/* Selected Teams Display */}
      {selectedTeams.length > 0 && (
        <div className="mb-6">
          <h3 className="text-white/80 font-semibold mb-4 text-sm uppercase tracking-wider">Selected Teams</h3>
          <div className="flex flex-wrap gap-2">
            {selectedTeams.map((teamId) => {
              // Find team in all leagues
              let teamName = teamId;
              let teamLogo = null;
              
              for (const league of leagues) {
                const team = league.teams.find(t => t.id === teamId);
                if (team) {
                  teamName = team.name;
                  teamLogo = team.logo;
                  break;
                }
              }
              
              return (
                <div key={teamId} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-lg blur opacity-50"></div>
                  <div className="relative flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                    {teamLogo && (
                      <img 
                        src={teamLogo} 
                        alt={teamName}
                        className="w-4 h-4 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <span className="text-white text-sm font-medium">{teamName}</span>
                    <button
                      onClick={() => toggleTeamSelection(teamId)}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
          <Button 
            onClick={nextStep} 
            className="relative w-full bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold py-4 rounded-2xl border-0 transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>Continue</span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-white/80 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '50ms'}}></div>
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '100ms'}}></div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <Button 
            onClick={() => setCurrentStep('notifications')} 
            className="relative w-full bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </>
  );

  // Render the notifications step
  const renderNotificationsStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-4">
          Enable Notifications
        </h1>
        <p className="text-white/70 font-light text-lg">
          Get alerts for live scores, goals, and important match events
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-600/30 via-red-600/30 to-pink-600/30 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
            <div className="absolute inset-2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white">
                <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-600/40 via-red-600/40 to-pink-600/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
          <Button 
            onClick={nextStep} 
            disabled={isLoading}
            className="relative w-full bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white font-bold py-4 rounded-2xl border-0 transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="relative flex items-center justify-center space-x-2">
              <span>{isLoading ? 'Enabling...' : 'Enable Notifications'}</span>
            </div>
          </Button>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-600/20 to-slate-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <Button 
            onClick={() => setCurrentStep('complete')} 
            className="relative w-full bg-white/5 backdrop-blur-xl border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-medium py-3 rounded-xl transition-all duration-300 hover:bg-white/10"
          >
            Skip for now
          </Button>
        </div>
      </div>
    </>
  );

  // Render the completion step
  const renderCompleteStep = () => (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-emerald-200 mb-4">
          You're All Set!
        </h1>
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
          <div className="w-12 h-0.5 bg-gradient-to-l from-transparent via-emerald-400 to-transparent rounded-full"></div>
        </div>
        <p className="text-white/70 font-light text-lg">
          Your account has been successfully set up
        </p>
      </div>
      
      <div className="flex flex-col items-center justify-center space-y-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-green-600/30 via-emerald-600/30 to-teal-600/30 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
          <div className="relative w-32 h-32 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
            <div className="absolute inset-2 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-white">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative bg-white/5 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/10 text-center">
            <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-200 to-emerald-200 mb-2">
              Welcome to MythaYun
            </p>
            <p className="text-white/70 font-light">
              Get ready for an amazing football experience
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-green-600/40 via-emerald-600/40 to-teal-600/40 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>
        <Button 
          onClick={nextStep} 
          className="relative w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl border-0 transition-all duration-500 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center space-x-2">
            <span>Start Exploring</span>
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-white/80 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
              <div className="w-1.5 h-1.5 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '50ms'}}></div>
              <div className="w-1.5 h-1.5 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '100ms'}}></div>
            </div>
          </div>
        </Button>
      </div>
    </>
  );

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'teams':
        return renderTeamsStep();
      case 'notifications':
        return renderNotificationsStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ultra-Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg p-6">
        <div className="group relative">
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
          
          <Card className="relative bg-transparent border-0 shadow-none overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-3xl"></div>
            <div className="absolute inset-0 rounded-3xl border border-white/20 hover:border-white/40 transition-all duration-500"></div>
            
            <CardContent className="relative z-10 pt-8 px-8 pb-8">
              {/* Ultra-Modern Progress Indicator */}
              <div className="flex justify-between mb-12">
                {(['welcome', 'teams', 'notifications', 'complete'] as OnboardingStep[]).map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className="relative group">
                        <div 
                          className={`absolute -inset-2 rounded-full blur-lg transition-opacity duration-300 ${
                            currentStep === step || index < ['welcome', 'teams', 'notifications', 'complete'].indexOf(currentStep)
                              ? 'bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 opacity-50' 
                              : 'opacity-0'
                          }`}
                        ></div>
                        <div 
                          className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                            currentStep === step 
                              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 text-white shadow-lg scale-110' 
                              : index < ['welcome', 'teams', 'notifications', 'complete'].indexOf(currentStep)
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' 
                                : 'bg-white/10 backdrop-blur-sm text-white/60 border border-white/20'
                          }`}
                        >
                          {index < ['welcome', 'teams', 'notifications', 'complete'].indexOf(currentStep) ? (
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                            </svg>
                          ) : (
                            index + 1
                          )}
                        </div>
                      </div>
                      <span className="text-xs mt-2 text-white/80 font-medium hidden sm:block">
                        {step.charAt(0).toUpperCase() + step.slice(1)}
                      </span>
                    </div>
                    
                    {index < 3 && (
                      <div className="flex-1 flex items-center mx-3 mt-5">
                        <div className="relative w-full h-1">
                          <div className="absolute inset-0 bg-white/10 rounded-full"></div>
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${
                              index < ['welcome', 'teams', 'notifications', 'complete'].indexOf(currentStep)
                                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 w-full' 
                                : 'bg-white/20 w-0'
                            }`}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* Step content */}
              {renderStepContent()}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
