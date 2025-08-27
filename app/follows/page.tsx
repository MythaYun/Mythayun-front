'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import MatchCard, { MatchData } from '@/components/matches/match-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FollowsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [followedMatches, setFollowedMatches] = useState<MatchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for followed matches
  const mockFollowedMatches: MatchData[] = [
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
      id: '3',
      homeTeam: { id: '105', name: 'Liverpool', score: 0 },
      awayTeam: { id: '106', name: 'Man City', score: 0 },
      status: 'upcoming',
      kickoff: new Date(Date.now() + 3600000).toISOString(),
      venue: 'Anfield',
      isFollowed: true
    }
  ];

  // Fetch followed matches
  useEffect(() => {
    // Check authentication - redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/follows');
      return;
    }

    // Simulating API call
    const fetchFollowedMatches = () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      setTimeout(() => {
        setFollowedMatches(mockFollowedMatches);
        setIsLoading(false);
      }, 1000);
    };

    fetchFollowedMatches();
  }, [isAuthenticated, router]);

  const refreshFollows = () => {
    setIsLoading(true);
    // Simulated refresh - in real app would call API
    setTimeout(() => {
      setFollowedMatches(mockFollowedMatches);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <MainLayout title="My Followed Matches">
      <div className="space-y-6">
        {isLoading ? (
          <Card className="h-64 flex items-center justify-center">
            <CardContent className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading your followed matches...</p>
            </CardContent>
          </Card>
        ) : followedMatches.length > 0 ? (
          <>
            <div className="grid gap-4">
              {followedMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
            <div className="flex justify-center">
              <Button onClick={refreshFollows} variant="outline" disabled={isLoading}>
                {isLoading ? 'Refreshing...' : 'Refresh Follows'}
              </Button>
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">No Followed Matches</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-500 mb-4">You haven't followed any matches yet.</p>
              <Button onClick={() => router.push('/')} variant="primary">
                Browse Matches
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
