'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import MainLayout from '@/components/layout/main-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { mockStadiumGuides, StadiumGuide } from '@/lib/mock-data';

export default function StadiumGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const resolvedParams = React.use(params);
  const stadiumId = resolvedParams.id;
  
  const [stadiumGuide, setStadiumGuide] = useState<StadiumGuide | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication first
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/stadiums/${stadiumId}/guide`);
      return;
    }
  }, [isAuthenticated, router, stadiumId]);

  // Fetch stadium guide data
  useEffect(() => {
    const fetchStadiumGuide = async () => {
      setIsLoading(true);
      try {
        // In production, this would be a real API call
        // const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/stadiums/${stadiumId}/guide`);
        // const data = await response.json();
        // setStadiumGuide(data);

        // Simulate API delay with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the stadium by id
        const decodedStadiumId = decodeURIComponent(stadiumId);
        
        // Look up the stadium guide by name or ID
        const guide = Object.values(mockStadiumGuides).find(
          guide => guide.id === decodedStadiumId || guide.name === decodedStadiumId
        );
        
        if (guide) {
          setStadiumGuide(guide);
        }
      } catch (error) {
        console.error('Error fetching stadium guide:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStadiumGuide();
  }, [stadiumId]);

  // Loading state
  if (isLoading) {
    return (
      <MainLayout showBackButton title="Stadium Guide">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  // Not found state
  if (!stadiumGuide) {
    return (
      <MainLayout showBackButton title="Stadium Not Found">
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 mb-4">Stadium guide not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showBackButton title={stadiumGuide.name}>
      {/* Stadium header */}
      <div className="mb-6">
        {stadiumGuide.imageUrl ? (
          <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
            <img 
              src={stadiumGuide.imageUrl} 
              alt={stadiumGuide.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-40 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-gray-400 text-xl font-semibold">{stadiumGuide.name}</span>
          </div>
        )}
        
        <h1 className="text-2xl font-bold mb-1">{stadiumGuide.name}</h1>
        <p className="text-gray-500 text-sm mb-3">{stadiumGuide.address}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            Capacity: {stadiumGuide.capacity.toLocaleString()}
          </div>
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            Opened: {stadiumGuide.openingYear}
          </div>
        </div>
        
        <p className="text-sm text-gray-700">
          {stadiumGuide.description}
        </p>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="transport" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transport" className="space-y-4">
          <h2 className="font-semibold text-lg mb-2">Getting to {stadiumGuide.name}</h2>
          
          {stadiumGuide.transportOptions.map((option, idx) => (
            <Card key={idx} className="mb-3">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="mr-3">
                    {option.type === 'tube' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                        <path d="M12 1.5a.75.75 0 0 1 .75.75V4.5a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM5.636 4.136a.75.75 0 0 1 1.06 0l1.592 1.591a.75.75 0 0 1-1.061 1.06l-1.591-1.59a.75.75 0 0 1 0-1.061Zm12.728 0a.75.75 0 0 1 0 1.06l-1.591 1.592a.75.75 0 0 1-1.06-1.061l1.59-1.591a.75.75 0 0 1 1.061 0ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm.75 6.75a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 1.5 0v2.25ZM18.364 19.864a.75.75 0 0 1-1.06 0l-1.592-1.591a.75.75 0 1 1 1.061-1.06l1.591 1.59a.75.75 0 0 1 0 1.061Zm-12.728 0a.75.75 0 0 1 0-1.06l1.591-1.592a.75.75 0 1 1 1.06 1.061l-1.59 1.591a.75.75 0 0 1-1.061 0Zm15.114-12a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 1 0-1.5h2.25ZM4.5 12.75a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75Z" />
                      </svg>
                    )}
                    {option.type === 'bus' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-600">
                        <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
                      </svg>
                    )}
                    {option.type === 'train' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-600">
                        <path d="M11.584 2.376a.75.75 0 0 1 .832 0l9 6a.75.75 0 1 1-.832 1.248L12 3.901 3.416 9.624a.75.75 0 0 1-.832-1.248l9-6Z" />
                        <path fillRule="evenodd" d="M20.25 10.332v9.918H21a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1 0-1.5h.75v-9.918a.75.75 0 0 1 .634-.74A49.109 49.109 0 0 1 12 9c2.59 0 5.134.202 7.616.592a.75.75 0 0 1 .634.74Zm-7.5 2.418a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Zm3-.75a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0v-6.75a.75.75 0 0 1 .75-.75ZM9 12.75a.75.75 0 0 0-1.5 0v6.75a.75.75 0 0 0 1.5 0v-6.75Z" clipRule="evenodd" />
                        <path d="M12 7.875a1.125 1.125 0 1 0 0-2.25 1.125 1.125 0 0 0 0 2.25Z" />
                      </svg>
                    )}
                    {option.type === 'car' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-600">
                        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                        <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                        <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                      </svg>
                    )}
                    {option.type === 'walk' && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-600">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-base">{option.name}</h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                    {option.distance && (
                      <p className="text-xs text-gray-500 mt-1">Distance: {option.distance}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="facilities" className="space-y-4">
          <h2 className="font-semibold text-lg mb-2">Stadium Facilities</h2>
          
          {stadiumGuide.facilities.map((facility, idx) => (
            <Card key={idx} className="mb-3">
              <CardContent className="p-4">
                <h3 className="font-medium text-base">{facility.name}</h3>
                <p className="text-xs text-gray-500 mb-1">Location: {facility.location}</p>
                {facility.description && (
                  <p className="text-sm text-gray-600">{facility.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="info" className="space-y-4">
          {/* Stadium rules */}
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-3">Stadium Rules</h2>
            <ul className="list-disc pl-5 space-y-1">
              {stadiumGuide.rules.map((rule, idx) => (
                <li key={idx} className="text-sm text-gray-700">{rule}</li>
              ))}
            </ul>
          </div>
          
          {/* Entrance gates */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Entrance Gates</h2>
            
            {stadiumGuide.entranceGates.map((gate, idx) => (
              <Card key={idx} className="mb-3">
                <CardContent className="p-4">
                  <h3 className="font-medium text-base">{gate.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">Location: {gate.location}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {gate.forTicketTypes.map((ticketType, tIdx) => (
                      <span key={tIdx} className="text-xs bg-primary-50 text-primary-800 px-2 py-0.5 rounded-full">
                        {ticketType}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
