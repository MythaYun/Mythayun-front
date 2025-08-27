import { MatchData } from '@/components/matches/match-card';

// Mock data for matches
export const mockMatches: MatchData[] = [
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

// Match events types
export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  teamId: string;
  playerId: string;
  playerName: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  description?: string;
}

// Mock events data
export const mockEvents: Record<string, MatchEvent[]> = {
  '1': [
    {
      id: '101',
      minute: 24,
      type: 'goal',
      teamId: '101',
      playerId: 'p1',
      playerName: 'Saka',
      assistPlayerId: 'p2',
      assistPlayerName: 'Odegaard',
      description: 'Great finish from outside the box'
    },
    {
      id: '102',
      minute: 42,
      type: 'yellow_card',
      teamId: '102',
      playerId: 'p3',
      playerName: 'James',
      description: 'Tactical foul'
    },
    {
      id: '103',
      minute: 56,
      type: 'goal',
      teamId: '101',
      playerId: 'p4',
      playerName: 'Martinelli',
      description: 'Header from a corner'
    },
    {
      id: '104',
      minute: 68,
      type: 'substitution',
      teamId: '102',
      playerId: 'p5',
      playerName: 'Sterling',
      assistPlayerId: 'p6',
      assistPlayerName: 'Pulisic',
      description: 'Tactical substitution'
    },
    {
      id: '105',
      minute: 73,
      type: 'goal',
      teamId: '102',
      playerId: 'p7',
      playerName: 'Gallagher',
      description: 'Great counter-attack'
    }
  ]
};

// Stadium guide data
export interface StadiumGuide {
  id: string;
  name: string;
  address: string;
  capacity: number;
  openingYear: number;
  description: string;
  transportOptions: TransportOption[];
  facilities: Facility[];
  rules: string[];
  entranceGates: EntranceGate[];
  imageUrl?: string;
}

export interface TransportOption {
  type: 'tube' | 'bus' | 'train' | 'car' | 'walk';
  name: string;
  description: string;
  distance?: string;
}

export interface Facility {
  name: string;
  location: string;
  description?: string;
}

export interface EntranceGate {
  name: string;
  location: string;
  forTicketTypes: string[];
}

// Mock stadium guides data
export const mockStadiumGuides: Record<string, StadiumGuide> = {
  'Emirates Stadium': {
    id: 'emirates-stadium',
    name: 'Emirates Stadium',
    address: 'Hornsey Rd, London N7 7AJ',
    capacity: 60704,
    openingYear: 2006,
    description: 'The Emirates Stadium is a football stadium in Holloway, London, England, and the home of Arsenal Football Club. With a capacity of 60,704, it is the fourth-largest football stadium in England.',
    transportOptions: [
      {
        type: 'tube',
        name: 'Arsenal (Piccadilly Line)',
        description: 'The closest station to the stadium, just a 3-minute walk away.',
        distance: '0.2 miles'
      },
      {
        type: 'tube',
        name: 'Finsbury Park (Victoria, Piccadilly Lines)',
        description: 'A larger station with more connections, about a 10-minute walk away.',
        distance: '0.6 miles'
      },
      {
        type: 'bus',
        name: 'Routes 29, 253, 254',
        description: 'Stop directly outside the stadium on Holloway Road.'
      },
      {
        type: 'car',
        name: 'Parking',
        description: 'Limited parking available. Arsenal operate a car-free zone around the stadium on matchdays. Consider using public transportation.'
      }
    ],
    facilities: [
      {
        name: 'The Armoury Store',
        location: 'Outside the stadium, near the Ken Friar Bridge',
        description: 'Official Arsenal merchandise and kit store.'
      },
      {
        name: 'Food Courts',
        location: 'Throughout concourses on all levels',
        description: 'Various food and drink options available.'
      },
      {
        name: 'The WM Club',
        location: 'West Stand, Club Level',
        description: 'Premium matchday dining experience.'
      },
      {
        name: 'First Aid Points',
        location: 'Available in all four stands',
        description: 'Medical assistance points staffed by trained professionals.'
      }
    ],
    rules: [
      'No smoking in the stadium',
      'No large bags allowed - bag searches in operation',
      'No bottles or cans',
      'No professional cameras',
      'No offensive behavior or language'
    ],
    entranceGates: [
      {
        name: 'Gate A',
        location: 'North Stand',
        forTicketTypes: ['Club Level', 'Premium Seats']
      },
      {
        name: 'Gate B',
        location: 'East Stand',
        forTicketTypes: ['General Admission', 'Away Supporters']
      },
      {
        name: 'Gate C',
        location: 'South Stand',
        forTicketTypes: ['General Admission', 'Family Enclosure']
      },
      {
        name: 'Gate D',
        location: 'West Stand',
        forTicketTypes: ['General Admission', 'Disabled Access']
      }
    ],
    imageUrl: 'https://i.imgur.com/example-emirates.jpg'
  },
  'Anfield': {
    id: 'anfield',
    name: 'Anfield',
    address: 'Anfield Rd, Anfield, Liverpool L4 0TH',
    capacity: 53394,
    openingYear: 1884,
    description: 'Anfield is a football stadium in Anfield, Liverpool, England, which has a seating capacity of 53,394, making it the seventh-largest football stadium in England. It has been the home of Liverpool FC since their formation in 1892.',
    transportOptions: [
      {
        type: 'bus',
        name: 'Routes 917 and 26',
        description: 'Direct service to Anfield stadium from Liverpool city center.',
        distance: 'N/A'
      },
      {
        type: 'train',
        name: 'Kirkdale Station',
        description: 'Nearest train station, approximately a 25-minute walk to the stadium.',
        distance: '1.2 miles'
      },
      {
        type: 'car',
        name: 'Parking',
        description: 'Limited parking near the stadium. Consider using the Park and Ride service.'
      }
    ],
    facilities: [
      {
        name: 'Liverpool FC Store',
        location: 'Outside the Kop Stand',
        description: 'Official Liverpool FC merchandise.'
      },
      {
        name: 'Food and Drink',
        location: 'All stands',
        description: 'Refreshments available throughout the stadium.'
      },
      {
        name: 'The Boot Room Sports Cafe',
        location: 'Outside the stadium',
        description: 'Family-friendly restaurant with football memorabilia.'
      }
    ],
    rules: [
      'No smoking in the stadium',
      'No large bags allowed',
      'No bottles, cans or alcohol',
      'No persistent standing',
      'No flares or pyrotechnics'
    ],
    entranceGates: [
      {
        name: 'Kop Stand Gates',
        location: 'Walton Breck Road',
        forTicketTypes: ['General Admission']
      },
      {
        name: 'Main Stand Gates',
        location: 'Anfield Road',
        forTicketTypes: ['General Admission', 'VIP']
      },
      {
        name: 'Away Section',
        location: 'Anfield Road Stand',
        forTicketTypes: ['Away Supporters']
      }
    ],
    imageUrl: 'https://i.imgur.com/example-anfield.jpg'
  }
};
