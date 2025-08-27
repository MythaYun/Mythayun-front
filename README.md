# Mythayun Live Scores Frontend

A mobile-optimized Progressive Web App (PWA) for real-time football scores and match updates. This application serves as the frontend for the Mythayun backend API, providing a responsive and intuitive interface for accessing live match data, stadium guides, and personalized follow features.

## Features

- **Mobile-First Design**: Optimized for mobile devices with intuitive touch interactions
- **PWA Capabilities**: Works offline, installable on home screen, push notifications
- **Live Match Updates**: Real-time score updates and match events
- **Team & League Following**: Personalized experience with favorite teams and leagues
- **Stadium Guides**: Access venue information and guides for match attendance
- **Authentication**: Secure user registration and login with token-based auth
- **Admin Interface**: Management dashboard for authorized users

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Authentication**: JWT with secure token refresh
- **PWA**: next-pwa for service worker and offline support

## Project Structure

```
mythayun-frontend/
├── app/               # Next.js 15 App Router pages
│   ├── auth/          # Authentication routes
│   ├── matches/       # Match listing and details
│   ├── follows/       # User follows management
│   ├── stadiums/      # Stadium guides
│   └── admin/         # Admin dashboard
├── components/        # React components
│   ├── ui/            # UI components (buttons, inputs, etc)
│   ├── layout/        # Layout components
│   ├── matches/       # Match-specific components
│   └── follows/       # Follow-specific components
├── lib/               # Shared utilities
│   ├── api/           # API client and endpoints
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── store/         # Zustand stores
├── public/            # Static assets
│   ├── icons/         # App icons for PWA
│   └── manifest.json  # PWA manifest
└── styles/            # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- Backend API running (see Mythayun backend repository)

### Installation

1. Clone the repository
2. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install
```

3. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333
```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Mobile Optimization

This application is designed with a mobile-first approach, featuring:

- Bottom navigation bar for easy thumb access
- Optimized touch targets (minimum 44px)
- Safe area insets for notched devices
- Responsive font sizes and spacing
- Hardware-accelerated animations
- Offline support via service worker

## Authentication Flow

The application uses a token-based authentication system with JWT:

1. User registers or logs in via `/auth/login` or `/auth/register`
2. Backend returns access and refresh tokens
3. Tokens are securely stored in localStorage
4. API requests include Authorization header
5. Token refresh is handled automatically on 401 responses
6. User state is managed via Zustand store

## API Integration

The frontend communicates with the Mythayun backend API using a custom client with:

- Automatic token handling
- Request/response interceptors
- Error handling
- TypeScript typing
