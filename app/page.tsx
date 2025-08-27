"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/main-layout';
import MatchCard, { MatchData } from '@/components/matches/match-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Using simple elements instead of icons to avoid import issues

// Mock data for matches
const mockMatches: MatchData[] = [
  {
    id: '1',
    homeTeam: { id: '101', name: 'Arsenal', score: 2 },
    awayTeam: { id: '102', name: 'Chelsea', score: 1 },
    status: 'live',
    kickoff: new Date().toISOString(),
    venue: 'Emirates Stadium',
    minute: 76,
    isFollowed: true
  },
  {
    id: '2',
    homeTeam: { id: '103', name: 'Liverpool', score: 0 },
    awayTeam: { id: '104', name: 'Manchester City', score: 0 },
    status: 'upcoming',
    kickoff: new Date(Date.now() + 3600000).toISOString(),
    venue: 'Anfield',
    isFollowed: false
  },
  {
    id: '3',
    homeTeam: { id: '105', name: 'Manchester United', score: 1 },
    awayTeam: { id: '106', name: 'Tottenham', score: 3 },
    status: 'finished',
    kickoff: new Date(Date.now() - 3600000).toISOString(),
    venue: 'Old Trafford',
    isFollowed: true
  },
  {
    id: '4',
    homeTeam: { id: '107', name: 'Leicester City', score: 2 },
    awayTeam: { id: '108', name: 'West Ham', score: 2 },
    status: 'finished',
    kickoff: new Date(Date.now() - 7200000).toISOString(),
    venue: 'King Power Stadium',
    isFollowed: false
  },
  {
    id: '5',
    homeTeam: { id: '109', name: 'Everton', score: 0 },
    awayTeam: { id: '110', name: 'Newcastle', score: 0 },
    status: 'upcoming',
    kickoff: new Date(Date.now() + 7200000).toISOString(),
    venue: 'Goodison Park',
    isFollowed: false
  }
];

// Filter types for matches
type FilterType = 'all' | 'live' | 'upcoming' | 'finished' | 'followed';

export default function Home() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Animation and real-time updates
  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to filter matches
  const getFilteredMatches = (filter: FilterType) => {
    if (filter === 'all') return mockMatches;
    
    return mockMatches.filter(match => {
      if (filter === 'live') return match.status === 'live';
      if (filter === 'upcoming') return match.status === 'upcoming';
      if (filter === 'finished') return match.status === 'finished';
      if (filter === 'followed') return match.isFollowed;
      return false;
    });
  };

  const liveMatches = mockMatches.filter(match => match.status === 'live');
  const upcomingMatches = mockMatches.filter(match => match.status === 'upcoming');
  const featuredMatch = liveMatches[0] || upcomingMatches[0] || mockMatches[0];

  return (
    <MainLayout noNavigation={true}>
      {/* Ultra-Modern Hero Section */}
      <section className="relative min-h-screen text-white overflow-hidden">
        {/* Advanced Visual Effects */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        </div>
        
        {/* Hero Content with Enhanced Container */}
        <div className={`relative z-10 flex flex-col justify-center min-h-screen transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            {/* Revolutionary Brand Identity */}
            <div className="mb-20">
              <div className="relative inline-block group">
                {/* Glowing background effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500 animate-pulse"></div>
                
                <h1 className="relative text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-100 mb-8 tracking-tight">
                  MythaYun
                </h1>
                
                {/* Animated underline */}
                <div className="relative flex items-center justify-center space-x-3 mb-6">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-pulse"></div>
                  <div className="relative">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-ping opacity-30"></div>
                  </div>
                  <div className="w-16 h-0.5 bg-gradient-to-l from-transparent via-blue-400 to-transparent rounded-full animate-pulse"></div>
                </div>
                
                {/* Floating tagline */}
                <div className="inline-flex items-center px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-white/90 tracking-wide">LIVE FOOTBALL EXPERIENCE</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Value Proposition */}
            <div className="mb-20 space-y-10">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-5xl mx-auto">
                Live Football Scores &
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  Real-time Updates
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                Stay connected to the beautiful game with instant scores, smart notifications, and comprehensive match insights powered by cutting-edge technology.
              </p>
            </div>
            
            {/* Enhanced Live Match Display */}
            {liveMatches.length > 0 && (
              <div className="mb-16">
                <div className="relative group max-w-2xl mx-auto">
                  {/* Glowing background */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    {/* Live indicator */}
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      <div className="relative">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-40"></div>
                      </div>
                      <span className="text-sm font-bold text-red-400 uppercase tracking-wider">LIVE NOW</span>
                      <div className="px-3 py-1 bg-white/10 rounded-full">
                        <span className="text-sm font-medium text-white">{featuredMatch.minute}'</span>
                      </div>
                    </div>
                    
                    {/* Match score */}
                    <div className="text-center mb-4">
                      <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                        <span className="text-blue-400">{featuredMatch.homeTeam.name}</span>
                        <span className="mx-4 text-green-400">{featuredMatch.homeTeam.score} - {featuredMatch.awayTeam.score}</span>
                        <span className="text-purple-400">{featuredMatch.awayTeam.name}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-white/60">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-sm" />
                        <span className="text-sm font-medium">{featuredMatch.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ultra-Modern CTA Buttons */}
            <div className="mb-20">
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                {/* Primary CTA */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
                  <Button 
                    onClick={() => router.replace('/auth/login')} 
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 px-10 py-4 text-lg font-semibold rounded-xl border-0 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-white/90 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                      <span>Get Started</span>
                      <div className="w-2 h-2 bg-white/60 rounded-full group-hover:translate-x-1 transition-transform duration-200"></div>
                    </div>
                  </Button>
                </div>
                
                {/* Secondary CTA */}
                <div className="relative group">
                  <Button 
                    onClick={() => router.push('/auth/register')} 
                    variant="outline" 
                    size="lg"
                    className="relative bg-white/5 backdrop-blur-sm border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 px-10 py-4 text-lg font-semibold rounded-xl group"
                  >
                    <div className="flex items-center space-x-3">
                      <span>Create Account</span>
                      <div className="w-5 h-5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg group-hover:scale-110 transition-transform duration-200" />
                      <div className="w-2 h-2 bg-white/60 rounded-full group-hover:translate-x-1 transition-transform duration-200"></div>
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-8 flex items-center justify-center space-x-8 text-white/60 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                  <span>Instant Access</span>
                </div>
              </div>
            </div>
            
            {/* Modern Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl mb-4 group-hover:bg-primary-600/30 transition-colors duration-300">
                  <div className="w-6 h-6 bg-primary-400 rounded-sm" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Real-time Updates</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Instant notifications for goals, cards, and key match events as they happen.</p>
              </div>
              
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl mb-4 group-hover:bg-primary-600/30 transition-colors duration-300">
                  <div className="w-6 h-6 bg-primary-400 rounded-full" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Smart Alerts</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Personalized notifications for your favorite teams and important matches.</p>
              </div>
              
              <div className="group text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600/20 rounded-xl mb-4 group-hover:bg-primary-600/30 transition-colors duration-300">
                  <div className="w-6 h-6 bg-primary-400 rounded" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Stadium Guides</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Comprehensive venue information and match atmosphere insights.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* Ultra-Modern Features Section */}
            <section className="relative py-32">
        {/* Advanced section separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        {/* Floating geometric elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0s'}}></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <div className="relative inline-block group mb-8">
              {/* Glowing background effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              <h2 className="relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 leading-tight">
                Everything You Need to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                  Follow the Game
                </span>
              </h2>
            </div>
            
            {/* Enhanced separator */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-pulse"></div>
              <div className="relative">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
              </div>
              <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-transparent rounded-full animate-pulse"></div>
            </div>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto font-light">
              Discover powerful features designed to enhance your football experience
            </p>
          </div>
          
          {/* Ultra-Modern CTA */}
          <div className="mt-20 flex justify-center">
            <div className="relative group">
              {/* Animated background glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 animate-pulse"></div>
              
              <Button 
                onClick={() => router.push('/features')}
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 px-12 py-4 text-lg font-bold rounded-2xl border-0 group overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative flex items-center space-x-3">
                  <span>Explore All Features</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-white/80 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '50ms'}}></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full group-hover:scale-125 transition-transform duration-200" style={{transitionDelay: '100ms'}}></div>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Live Matches Section */}
      <section className="relative py-24">
        {/* Section separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Live Matches</h2>
              <p className="text-slate-300 text-xl font-light">Follow the action in real-time</p>
            </div>
            <div className="live-indicator-large flex items-center justify-center lg:justify-start mt-6 lg:mt-0">
              <div className="relative">
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                </span>
              </div>
              <span className="ml-3 text-red-400 font-semibold text-lg tracking-wide">LIVE UPDATES</span>
            </div>
          </div>
          
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 p-1 mb-12">
            <Tabs defaultValue="all" className="mb-6" onValueChange={(value) => setActiveFilter(value as FilterType)}>
              <TabsList className="p-1 bg-slate-700/50 rounded-xl mb-6">
                <TabsTrigger value="all" className="text-sm font-medium px-5 py-2.5 rounded-lg data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300">All Matches</TabsTrigger>
                <TabsTrigger value="live" className="text-sm font-medium px-5 py-2.5 rounded-lg data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300">Live</TabsTrigger>
                <TabsTrigger value="upcoming" className="text-sm font-medium px-5 py-2.5 rounded-lg data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300">Upcoming</TabsTrigger>
                <TabsTrigger value="finished" className="text-sm font-medium px-5 py-2.5 rounded-lg data-[state=active]:bg-slate-600 data-[state=active]:text-white text-slate-300">Finished</TabsTrigger>
              </TabsList>
              
              <div className="px-4 py-2">
                <TabsContent value="all" className="space-y-5 animate-fade-in">
                  {getFilteredMatches('all').map((match) => (
                    <div key={match.id} className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-floating">
                      <MatchCard match={match} />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="live" className="space-y-5 animate-fade-in">
                  {getFilteredMatches('live').map((match) => (
                    <div key={match.id} className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-floating">
                      <MatchCard match={match} />
                    </div>
                  ))}
                  {getFilteredMatches('live').length === 0 && (
                    <div className="text-center py-12 px-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                      <div className="w-12 h-12 bg-slate-500 rounded-full mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No live matches at the moment</p>
                      <p className="text-slate-500 text-sm mt-1">Check back soon for upcoming matches</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="upcoming" className="space-y-5 animate-fade-in">
                  {getFilteredMatches('upcoming').map((match) => (
                    <div key={match.id} className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-floating">
                      <MatchCard match={match} />
                    </div>
                  ))}
                  {getFilteredMatches('upcoming').length === 0 && (
                    <div className="text-center py-12 px-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                      <div className="w-12 h-12 bg-slate-500 rounded-full mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No upcoming matches scheduled</p>
                      <p className="text-slate-500 text-sm mt-1">Check back later for the latest schedule</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="finished" className="space-y-5 animate-fade-in">
                  {getFilteredMatches('finished').map((match) => (
                    <div key={match.id} className="transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-floating">
                      <MatchCard match={match} />
                    </div>
                  ))}
                  {getFilteredMatches('finished').length === 0 && (
                    <div className="text-center py-12 px-6 bg-slate-800/40 rounded-xl border border-slate-700/30">
                      <div className="w-12 h-12 bg-slate-500 rounded-full mx-auto mb-3" />
                      <p className="text-slate-300 font-medium">No finished matches to display</p>
                      <p className="text-slate-500 text-sm mt-1">Recent match results will appear here</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex flex-col items-center">
              <p className="text-gray-500 mb-4 max-w-md mx-auto">Get personalized match alerts, follow your favorite teams, and access premium features</p>
              <div className="relative group inline-block">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
                <Button 
                  onClick={() => router.push('/auth/register')} 
                  size="lg"
                  className="relative bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-base font-semibold shadow-lg"
                >
                  Sign Up for Full Access
                </Button>
              </div>
              <p className="mt-3 text-xs text-gray-400">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-Modern Download Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Advanced section separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
        
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-purple-600/10 via-pink-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative mx-auto max-w-sm group">
                {/* Ultra-Modern Phone mockup */}
                <div className="relative z-10 overflow-hidden rounded-[3rem] border-4 border-white/20 bg-black/40 backdrop-blur-xl shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group-hover:scale-105">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 rounded-b-2xl bg-black/60 z-20"></div>
                  <div className="aspect-[9/19] overflow-hidden rounded-[2.5rem]">
                    <div className="bg-gradient-to-br from-blue-900/80 via-purple-900/80 to-cyan-900/80 w-full h-full flex items-center justify-center overflow-hidden relative backdrop-blur-sm">
                      {/* Enhanced App content */}
                      <div className="text-white flex flex-col items-center p-8 w-full">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl mb-8 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                          <div className="text-white text-2xl font-bold">MY</div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">MythaYun</h3>
                        <p className="text-white/80 text-center text-sm mb-10 font-light">Live Football Experience</p>
                        
                        <div className="w-full bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl">
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mr-4 flex items-center justify-center shadow-lg">
                                <div className="w-5 h-5 bg-white rounded-lg"></div>
                              </div>
                              <div className="text-base font-semibold">Arsenal</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">2</div>
                          </div>
                          <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full mr-4 flex items-center justify-center shadow-lg">
                                <div className="w-5 h-5 bg-white rounded-lg"></div>
                              </div>
                              <div className="text-base font-semibold">Chelsea</div>
                            </div>
                            <div className="text-2xl font-bold text-blue-400">1</div>
                          </div>
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center space-x-3 bg-red-500/20 px-4 py-2 rounded-full border border-red-500/30">
                              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                              <span className="text-sm text-red-300 font-semibold">45' LIVE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Advanced floating elements */}
                <div className="absolute -z-10 top-1/4 -left-12 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl animate-pulse"></div>
                <div className="absolute -z-10 bottom-1/4 -right-12 w-64 h-64 rounded-full bg-gradient-to-l from-purple-500/20 to-pink-500/20 blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 text-center lg:text-left">
              {/* Ultra-Modern Title */}
              <div className="relative inline-block group mb-12">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <h2 className="relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-100 leading-tight">
                  Get the Full Experience
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400">
                    on Your Mobile
                  </span>
                </h2>
              </div>
              
              {/* Enhanced separator */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full animate-pulse"></div>
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-30"></div>
                </div>
                <div className="w-20 h-0.5 bg-gradient-to-l from-transparent via-purple-400 to-transparent rounded-full animate-pulse"></div>
              </div>
              
              <p className="text-xl text-white/80 mb-16 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                Download our premium app and unlock the ultimate football experience. Stay connected to every match, every goal, every moment.
              </p>
              
              {/* Ultra-Modern Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 bg-white rounded-lg"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-200 transition-colors duration-300">Push Notifications</h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">Never miss a goal with instant alerts</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-200 transition-colors duration-300">Live Statistics</h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">Detailed stats and real-time analysis</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-green-200 transition-colors duration-300">Follow Teams</h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">Track your favorite teams effortlessly</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 bg-white rounded"></div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg mb-2 group-hover:text-orange-200 transition-colors duration-300">Offline Access</h3>
                        <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">Access content without internet connection</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ultra-Modern Download Buttons */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <Button variant="outline" className="relative bg-black/30 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-black/50 text-white px-8 py-6 rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-4px] shadow-2xl hover:shadow-blue-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <div className="w-7 h-7 bg-black rounded-lg"></div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">Download on the</span>
                        <span className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors duration-300">App Store</span>
                      </div>
                    </div>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Button>
                </div>
                
                <div className="group relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-600/30 via-blue-600/30 to-purple-600/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  <Button variant="outline" className="relative bg-black/30 backdrop-blur-xl border border-white/20 hover:border-white/40 hover:bg-black/50 text-white px-8 py-6 rounded-2xl transition-all duration-500 group-hover:scale-105 group-hover:translate-y-[-4px] shadow-2xl hover:shadow-green-500/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <div className="w-6 h-6 bg-white rounded-lg transform rotate-45"></div>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">Get it on</span>
                        <span className="text-lg font-bold text-white group-hover:text-green-200 transition-colors duration-300">Google Play</span>
                      </div>
                    </div>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </Button>
                </div>
              </div>
              
              {/* Trust indicators */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-8">
                <div className="flex items-center space-x-2 text-white/60">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Free Forever</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span className="text-sm font-medium">No Ads</span>
                </div>
                <div className="flex items-center space-x-2 text-white/60">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-sm font-medium">Instant Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced About/FAQ Section */}
      <section className="relative py-24">
        {/* Section separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">About MythaYun</h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-primary-500 rounded-full"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-primary-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">What is MythaYun?</h3>
              <p className="text-slate-300 leading-relaxed">
                MythaYun is a real-time soccer tracking application that provides live scores, match stats, and personalized notifications for your favorite teams and leagues around the world.
              </p>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">How do I get started?</h3>
              <p className="text-slate-300 leading-relaxed">
                Simply register for a free account, select your favorite teams during onboarding, and start receiving real-time updates. Basic match information is available without an account, but personalized features require registration.
              </p>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Which leagues are supported?</h3>
              <p className="text-slate-300 leading-relaxed">
                MythaYun currently supports major leagues including Premier League, La Liga, Serie A, Bundesliga, Ligue 1, and many more. We're constantly expanding our coverage to include additional competitions.
              </p>
            </div>
            
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 text-white">Is MythaYun free to use?</h3>
              <p className="text-slate-300 leading-relaxed">
                Yes, MythaYun is completely free to use! Create an account to unlock all features and customize your experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Contact Section */}
      <section className="relative py-24">
        {/* Section separator */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">Need Help?</h2>
            <p className="text-slate-300 text-xl font-light max-w-2xl mx-auto">
              Our support team is ready to assist you with any questions or issues you may have.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-8 max-w-2xl mx-auto">
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 w-full">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl mx-auto flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary-400 rounded-sm"></div>
                  </div>
                </div>
                <h3 className="font-semibold mb-3 text-white text-lg">Email Support</h3>
                <p className="text-slate-300">support@mythayun.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 w-full">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-primary-500/20 rounded-xl mx-auto flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-semibold mb-3 text-white text-lg">Help Center</h3>
                <p className="text-slate-300">Visit our help center</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">MythaYun</h3>
              <p className="text-gray-400 max-w-xs">
                Real-time soccer updates and personalized notifications for the most passionate fans.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Features</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Leagues</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Teams</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Terms</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Privacy</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Cookies</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center sm:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} MythaYun. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
}
