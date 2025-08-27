'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';

export interface MatchTeam {
  id: string;
  name: string;
  logo?: string;
  score?: number;
}

export interface MatchData {
  id: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  status: 'upcoming' | 'live' | 'finished';
  kickoff: string;
  venue?: string;
  minute?: number;
  isFollowed?: boolean;
}

interface MatchCardProps {
  match: MatchData;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { id, homeTeam, awayTeam, status, kickoff, venue, minute, isFollowed } = match;
  // Use state for dynamic values that cause hydration issues
  const [formattedDate, setFormattedDate] = useState<string>('--');
  
  // Format the kickoff time only on client-side
  useEffect(() => {
    try {
      const date = new Date(kickoff);
      const day = date.getDate();
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      setFormattedDate(`${day} ${month}, ${hours}:${minutes}`);
    } catch (e) {
      console.error('Error formatting date:', e);
      setFormattedDate('TBD');
    }
  }, [kickoff]);
  
  // Determine status indicator color with enhanced styling
  const getStatusColor = () => {
    switch (status) {
      case 'live':
        return 'bg-error';
      case 'finished':
        return 'bg-gray-400';
      case 'upcoming':
      default:
        return 'bg-primary-600';
    }
  };
  
  // Get static status text (without dynamic date formatting)
  const getStatusText = () => {
    switch (status) {
      case 'live':
        return `LIVE ${minute ? minute + "'" : ''}`;
      case 'finished':
        return 'FT';
      case 'upcoming':
      default:
        return formattedDate;
    }
  };
  
  const getScoreDisplay = (score?: number) => {
    return (status === 'upcoming' ? '-' : score ?? 0);
  };

  return (
    <Link href={`/matches/${id}`} className="block">
      <Card variant="default" isInteractive className="mb-3 hover:shadow-floating transition-all duration-200">
        {/* Match status bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
          <div className="flex items-center">
            <span className={`h-2 w-2 rounded-full mr-2 ${getStatusColor()} ${status === 'live' ? 'live-indicator' : ''}`} />
            <span className="text-xs font-medium text-gray-700">{getStatusText()}</span>
          </div>
          
          {venue && (
            <span className="text-xs text-gray-500 truncate max-w-[180px]">{venue}</span>
          )}
        </div>
        
        {/* Teams and scores */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex flex-col items-center w-5/12">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
              {homeTeam.logo ? (
                <img 
                  src={homeTeam.logo} 
                  alt={`${homeTeam.name} logo`} 
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {homeTeam.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 text-center line-clamp-1">
              {homeTeam.name}
            </span>
          </div>
          
          {/* Score */}
          <div className="flex items-center justify-center w-2/12">
            <span className={`text-xl font-bold ${status === 'live' ? 'text-error' : 'text-gray-900'}`}>
              {getScoreDisplay(homeTeam.score)}
            </span>
            <span className="mx-1 text-xl font-bold text-gray-900">-</span>
            <span className={`text-xl font-bold ${status === 'live' ? 'text-error' : 'text-gray-900'}`}>
              {getScoreDisplay(awayTeam.score)}
            </span>
          </div>
          
          {/* Away team */}
          <div className="flex flex-col items-center w-5/12">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
              {awayTeam.logo ? (
                <img 
                  src={awayTeam.logo} 
                  alt={`${awayTeam.name} logo`} 
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <span className="text-xl font-bold text-gray-400">
                  {awayTeam.name.charAt(0)}
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-gray-900 text-center line-clamp-1">
              {awayTeam.name}
            </span>
          </div>
        </div>
        
        {/* Follow indicator */}
        {isFollowed && (
          <div className="mt-3 border-t border-gray-100 pt-2 flex items-center text-primary-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
              <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
            </svg>
            <span className="text-xs font-medium">Following</span>
          </div>
        )}
      </Card>
    </Link>
  );
}
