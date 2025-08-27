'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/auth-store';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity: number;
  imageUrl?: string;
  hasGuide: boolean;
}

export default function StadiumsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock stadium data
  const mockStadiums: Stadium[] = [
    {
      id: '1',
      name: 'Emirates Stadium',
      city: 'London',
      country: 'England',
      capacity: 60704,
      imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=3000&auto=format&fit=crop',
      hasGuide: true
    },
    {
      id: '2',
      name: 'Old Trafford',
      city: 'Manchester',
      country: 'England',
      capacity: 74140,
      imageUrl: 'https://images.unsplash.com/photo-1621551127871-9c89451cfa85?q=80&w=3000&auto=format&fit=crop',
      hasGuide: true
    },
    {
      id: '3',
      name: 'Anfield',
      city: 'Liverpool',
      country: 'England',
      capacity: 53394,
      imageUrl: 'https://images.unsplash.com/photo-1594396539319-ab5694d5fee0?q=80&w=3000&auto=format&fit=crop',
      hasGuide: true
    },
    {
      id: '4',
      name: 'Camp Nou',
      city: 'Barcelona',
      country: 'Spain',
      capacity: 99354,
      imageUrl: 'https://images.unsplash.com/photo-1537241210498-b70b9ec0d5af?q=80&w=3000&auto=format&fit=crop',
      hasGuide: true
    },
    {
      id: '5',
      name: 'Santiago Bernabéu',
      city: 'Madrid',
      country: 'Spain',
      capacity: 81044,
      hasGuide: false
    }
  ];

  // Fetch stadiums
  useEffect(() => {
    const fetchStadiums = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setStadiums(mockStadiums);
        setIsLoading(false);
      }, 1000);
    };

    fetchStadiums();
  }, []);

  // Filter stadiums based on search term
  const filteredStadiums = searchTerm
    ? stadiums.filter(stadium => 
        stadium.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stadium.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stadium.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : stadiums;

  const viewStadiumGuide = (stadiumId: string) => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/stadiums/${stadiumId}/guide`);
    } else {
      router.push(`/stadiums/${stadiumId}/guide`);
    }
  };
  
  // Protect page access
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/stadiums');
    }
  }, [isAuthenticated, router]);

  return (
    <MainLayout title="Stadiums">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search stadiums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredStadiums.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredStadiums.map(stadium => (
              <Card key={stadium.id} className="overflow-hidden">
                <div className="relative h-40 w-full">
                  {stadium.imageUrl ? (
                    <Image
                      src={stadium.imageUrl}
                      alt={stadium.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                      </svg>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{stadium.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{stadium.city}, {stadium.country}</p>
                  <p className="text-sm">Capacity: {stadium.capacity.toLocaleString()}</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => viewStadiumGuide(stadium.id)}
                    variant={stadium.hasGuide ? "primary" : "outline"}
                    disabled={!stadium.hasGuide}
                    className="w-full"
                  >
                    {stadium.hasGuide ? 'View Stadium Guide' : 'Guide Coming Soon'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500 mb-2">No stadiums found matching your search.</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </Button>
            )}
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
