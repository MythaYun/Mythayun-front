# Mythayun Live Score API Documentation

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
- [Base URLs](#base-urls)
- [API Endpoints](#api-endpoints)
  - [Core Endpoints](#core-endpoints)
  - [Authentication Endpoints](#authentication-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Fixtures & Matches](#fixtures--matches)
  - [Follows](#follows)
  - [Stadium Guides](#stadium-guides)
  - [Notifications](#notifications)
  - [Admin Endpoints](#admin-endpoints)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## Introduction

The Mythayun Live Score API provides real-time football match data, user management, and team following capabilities. This documentation covers all available endpoints, their parameters, and example responses.

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). To authenticate:

1. Obtain an access token via `/auth/login` or `/auth/register`
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer {your_access_token}
   ```

Tokens expire after 15 minutes (900 seconds). Use the refresh token endpoint to obtain a new access token.

## Base URLs

| Environment | URL                    |
|------------|------------------------|
| Development | http://localhost:3333  |
| Production  | https://api.mythayun.com |

## API Endpoints

### Core Endpoints

#### Root Endpoint

```
GET /
```

Returns basic application information.

**Example Response:**
```json
{
  "hello": "world",
  "app": "Mythayun Live Score API",
  "version": "1.0.0"
}
```

#### Health Check

```
GET /health
```

Returns system health status including connected services.

**Example Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-08-14T14:25:10.123Z",
  "services": {
    "api": "healthy",
    "footballApi": "healthy"
  }
}
```

### Authentication Endpoints

#### Register User

```
POST /auth/register
```

Creates a new user account and returns authentication tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid-string",
    "fullName": "John Doe",
    "email": "user@example.com",
    "authProvider": "email",
    "emailVerified": false,
    "createdAt": "2025-08-14T13:50:03.314+00:00",
    "updatedAt": "2025-08-14T13:50:03.314+00:00"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  },
  "isNewUser": true
}
```

#### Login

```
POST /auth/login
```

Authenticates a user and returns tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "John Doe",
    "authProvider": "email"
  },
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

#### Social Authentication

```
POST /auth/social-auth
```

Authenticates or registers a user via social providers.

**Request Body:**
```json
{
  "provider": "google",
  "token": "provider-token-string",
  "profile": {
    "id": "provider-id",
    "email": "user@example.com",
    "name": "John Doe",
    "picture": "https://example.com/photo.jpg"
  }
}
```

**Response:** Same as login response.

#### Refresh Token

```
POST /auth/refresh-token
```

Issues a new access token using a valid refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "message": "Token refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "expiresIn": 900,
    "tokenType": "Bearer"
  }
}
```

#### Logout

```
POST /auth/logout
```

Invalidates the current user's tokens.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "Logout successful"
}
```

### User Endpoints

#### Get User Profile

```
GET /api/v1/profile
```

Returns the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "authProvider": "email",
    "emailVerified": false,
    "profilePicture": null,
    "timezone": null,
    "language": null,
    "isPrivate": false,
    "createdAt": "2025-08-14T13:50:03.314+00:00",
    "updatedAt": "2025-08-14T13:50:17.605+00:00"
  }
}
```

#### Update User Profile

```
PUT /api/v1/profile
```

Updates the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "profilePicture": "https://example.com/updated-photo.jpg",
  "timezone": "America/New_York",
  "language": "en",
  "isPrivate": true
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "fullName": "Updated Name",
    "profilePicture": "https://example.com/updated-photo.jpg",
    "timezone": "America/New_York",
    "language": "en",
    "isPrivate": true,
    "updatedAt": "2025-08-14T14:15:22.451+00:00"
  }
}
```

#### Change Password

```
POST /api/v1/change-password
```

Changes the authenticated user's password.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### Delete Account

```
DELETE /api/v1/account
```

Deletes the authenticated user's account.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "password": "CurrentPassword123!"
}
```

**Response:**
```json
{
  "message": "Account deleted successfully"
}
```

### Fixtures & Matches

#### Get Fixtures

```
GET /api/v1/fixtures
```

Returns a list of football fixtures (upcoming and past matches).

**Query Parameters:**
- `date` (optional): Filter by date (YYYY-MM-DD)
- `league` (optional): Filter by league ID
- `team` (optional): Filter by team ID
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number for pagination (default: 1)

**Response:**
```json
{
  "fixtures": [
    {
      "id": "uuid-string",
      "leagueId": "uuid-string",
      "homeTeamId": "uuid-string",
      "awayTeamId": "uuid-string",
      "venueId": "uuid-string",
      "status": "not_started",
      "kickoffTime": "2025-08-15T15:00:00.000Z",
      "homeTeam": {
        "id": "uuid-string",
        "name": "Arsenal FC",
        "logo": "https://example.com/arsenal.png"
      },
      "awayTeam": {
        "id": "uuid-string",
        "name": "Chelsea FC",
        "logo": "https://example.com/chelsea.png"
      },
      "league": {
        "id": "uuid-string",
        "name": "Premier League",
        "logo": "https://example.com/premier-league.png"
      },
      "venue": {
        "id": "uuid-string",
        "name": "Emirates Stadium",
        "city": "London"
      }
    }
  ],
  "pagination": {
    "total": 120,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 6
  }
}
```

#### Get Live Fixtures

```
GET /api/v1/fixtures/live
```

Returns currently ongoing matches.

**Response:** Similar to /fixtures, but only includes matches with status "in_progress"

#### Get Match Details

```
GET /api/v1/matches/:id
```

Returns detailed information about a specific match, including events and statistics.

**Path Parameters:**
- `id`: Match/fixture ID

**Response:**
```json
{
  "match": {
    "id": "uuid-string",
    "leagueId": "uuid-string",
    "homeTeamId": "uuid-string",
    "awayTeamId": "uuid-string",
    "venueId": "uuid-string",
    "status": "in_progress",
    "kickoffTime": "2025-08-14T15:00:00.000Z",
    "currentMinute": 65,
    "homeScore": 2,
    "awayScore": 1,
    "homeTeam": {
      "id": "uuid-string",
      "name": "Arsenal FC",
      "logo": "https://example.com/arsenal.png"
    },
    "awayTeam": {
      "id": "uuid-string",
      "name": "Chelsea FC",
      "logo": "https://example.com/chelsea.png"
    },
    "league": {
      "id": "uuid-string",
      "name": "Premier League",
      "logo": "https://example.com/premier-league.png"
    },
    "venue": {
      "id": "uuid-string",
      "name": "Emirates Stadium",
      "city": "London"
    },
    "events": [
      {
        "id": "uuid-string",
        "matchId": "uuid-string",
        "type": "goal",
        "minute": 23,
        "teamId": "uuid-string",
        "playerId": "uuid-string",
        "playerName": "Pierre-Emerick Aubameyang",
        "assistPlayerId": "uuid-string",
        "assistPlayerName": "Bukayo Saka",
        "detail": "Goal"
      }
    ],
    "statistics": {
      "possession": {
        "home": 58,
        "away": 42
      },
      "shots": {
        "home": 12,
        "away": 8
      },
      "shotsOnTarget": {
        "home": 5,
        "away": 3
      },
      "corners": {
        "home": 6,
        "away": 2
      },
      "fouls": {
        "home": 7,
        "away": 9
      }
    }
  }
}
```

### Follows

#### Follow an Entity

```
POST /api/v1/follows
```

Creates a follow relationship between the user and an entity (team, league).

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "entityType": "team",
  "entityId": "uuid-string",
  "notificationType": "all"
}
```

**Response:**
```json
{
  "message": "Follow successful",
  "follow": {
    "id": "uuid-string",
    "userId": "uuid-string",
    "entityType": "team",
    "entityId": "uuid-string",
    "notificationType": "all",
    "createdAt": "2025-08-14T14:30:15.223+00:00"
  }
}
```

#### Unfollow an Entity

```
DELETE /api/v1/follows
```

Removes a follow relationship.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "entityType": "team",
  "entityId": "uuid-string"
}
```

**Response:**
```json
{
  "message": "Unfollowed successfully"
}
```

#### Get User Follows

```
GET /api/v1/follows
```

Returns entities followed by the authenticated user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `entityType` (optional): Filter by type ("team" or "league")

**Response:**
```json
{
  "follows": [
    {
      "id": "uuid-string",
      "entityType": "team",
      "entityId": "uuid-string",
      "notificationType": "all",
      "createdAt": "2025-08-14T14:30:15.223+00:00",
      "entity": {
        "id": "uuid-string",
        "name": "Arsenal FC",
        "logo": "https://example.com/arsenal.png"
      }
    }
  ]
}
```

#### Get Follow Statistics

```
GET /api/v1/follows/stats
```

Returns follow statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "stats": {
    "totalFollows": 12,
    "teamFollows": 10,
    "leagueFollows": 2
  }
}
```

#### Get Follow Recommendations

```
GET /api/v1/follows/recommendations
```

Returns recommended teams/leagues to follow.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `entityType` (optional): Filter by type ("team" or "league")
- `limit` (optional): Number of recommendations (default: 10)

**Response:**
```json
{
  "recommendations": [
    {
      "id": "uuid-string",
      "type": "team",
      "name": "Manchester City",
      "logo": "https://example.com/mancity.png",
      "popularity": 92,
      "followerCount": 15243
    }
  ]
}
```

#### Update Notification Preferences

```
PUT /api/v1/follows/notifications
```

Updates notification preferences for a follow.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "entityType": "team",
  "entityId": "uuid-string",
  "notificationType": "goals_only"
}
```

**Response:**
```json
{
  "message": "Notification preferences updated",
  "follow": {
    "id": "uuid-string",
    "entityType": "team",
    "entityId": "uuid-string",
    "notificationType": "goals_only",
    "updatedAt": "2025-08-14T14:45:33.621+00:00"
  }
}
```

#### Bulk Follow

```
POST /api/v1/follows/bulk
```

Creates multiple follow relationships at once.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "follows": [
    {
      "entityType": "team",
      "entityId": "uuid-string-1",
      "notificationType": "all"
    },
    {
      "entityType": "league",
      "entityId": "uuid-string-2",
      "notificationType": "important"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Bulk follow successful",
  "successCount": 2,
  "failedCount": 0
}
```

#### Check Follow Status

```
GET /api/v1/follows/check/:entityType/:entityId
```

Checks if the authenticated user follows a specific entity.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `entityType`: Entity type ("team" or "league")
- `entityId`: Entity ID

**Response:**
```json
{
  "following": true,
  "follow": {
    "id": "uuid-string",
    "notificationType": "all",
    "createdAt": "2025-08-14T14:30:15.223+00:00"
  }
}
```

#### Get Entity Followers

```
GET /api/v1/entities/:entityType/:entityId/followers
```

Returns users who follow a specific entity.

**Path Parameters:**
- `entityType`: Entity type ("team" or "league")
- `entityId`: Entity ID

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `page` (optional): Page number (default: 1)

**Response:**
```json
{
  "followerCount": 15243,
  "followers": [
    {
      "id": "uuid-string",
      "fullName": "John Doe",
      "profilePicture": "https://example.com/profile.jpg"
    }
  ],
  "pagination": {
    "total": 15243,
    "perPage": 20,
    "currentPage": 1,
    "lastPage": 763
  }
}
```

### Stadium Guides

#### Get Stadium Guide

```
GET /api/v1/stadiums/:venueId/guide
```

Returns stadium information and guide for a specific venue.

**Path Parameters:**
- `venueId`: Venue/Stadium ID

**Response:**
```json
{
  "stadium": {
    "id": "uuid-string",
    "name": "Emirates Stadium",
    "city": "London",
    "country": "England",
    "capacity": 60704,
    "address": "Hornsey Rd, London N7 7AJ",
    "coordinates": {
      "latitude": 51.5549,
      "longitude": -0.108436
    },
    "imageUrl": "https://example.com/emirates.jpg"
  },
  "guide": {
    "gettingThere": {
      "public": "Arsenal station (Piccadilly Line) is the nearest tube station, just a few minutes walk from the stadium.",
      "car": "Limited parking available. Consider using public transport."
    },
    "entrances": [
      {
        "name": "North Bank",
        "description": "Located on Drayton Park",
        "gates": ["A", "B", "C"]
      }
    ],
    "facilities": [
      {
        "type": "food",
        "name": "The Armoury Cafe",
        "location": "North Stand, Ground Floor",
        "description": "Coffee shop and light snacks"
      }
    ],
    "rules": [
      "No smoking policy throughout the stadium",
      "No large bags allowed inside"
    ]
  }
}
```

### Notifications

#### Register Device

```
POST /api/v1/notifications/devices
```

Registers a device for push notifications.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "token": "device-token-string",
  "platform": "ios",
  "deviceModel": "iPhone 12",
  "osVersion": "15.4"
}
```

**Response:**
```json
{
  "message": "Device registered successfully",
  "device": {
    "id": "uuid-string",
    "userId": "uuid-string",
    "token": "device-token-string",
    "platform": "ios",
    "createdAt": "2025-08-14T15:00:12.451+00:00"
  }
}
```

#### Unregister Device

```
DELETE /api/v1/notifications/devices
```

Unregisters a device from push notifications.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "token": "device-token-string"
}
```

**Response:**
```json
{
  "message": "Device unregistered successfully"
}
```

#### List Devices

```
GET /api/v1/notifications/devices
```

Lists the user's registered devices.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "devices": [
    {
      "id": "uuid-string",
      "token": "device-token-string",
      "platform": "ios",
      "deviceModel": "iPhone 12",
      "osVersion": "15.4",
      "createdAt": "2025-08-14T15:00:12.451+00:00",
      "lastUsedAt": "2025-08-14T15:20:33.102+00:00"
    }
  ]
}
```

#### Send Test Notification

```
POST /api/v1/notifications/test
```

Sends a test notification to the user's devices.

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "Test notification sent",
  "sentToDevices": 1
}
```

### Admin Endpoints

**Note:** All admin endpoints require both JWT authentication and admin privileges.

#### Admin Health Check

```
GET /admin/v1/health
```

Returns detailed system health status.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-14T15:10:22.451Z",
  "services": {
    "jobs": "healthy",
    "websocket": "disabled",
    "database": "healthy"
  },
  "uptime": 54321.123,
  "memory": {
    "rss": 82788352,
    "heapTotal": 34844672,
    "heapUsed": 32336272
  },
  "version": "v20.18.0"
}
```

#### Job Status

```
GET /admin/v1/jobs
```

Returns status of all background jobs.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "jobs": [
    {
      "name": "daily-fixtures-ingestion",
      "schedule": "0 6 * * *",
      "enabled": true,
      "running": false,
      "lastRun": "2025-08-14T06:00:00.017Z",
      "nextRun": "2025-08-15T06:00:00.000Z",
      "stats": {
        "successCount": 45,
        "errorCount": 2,
        "avgDuration": 4321
      }
    }
  ]
}
```

#### Trigger Job

```
POST /admin/v1/jobs/:jobName/trigger
```

Manually triggers a job to run immediately.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Path Parameters:**
- `jobName`: Name of the job to trigger

**Request Body:**
```json
{
  "options": {
    "priority": "high",
    "forceRefresh": true
  }
}
```

**Response:**
```json
{
  "message": "Job triggered successfully",
  "job": {
    "name": "daily-fixtures-ingestion",
    "triggered": true,
    "status": "running"
  }
}
```

#### Start Job

```
POST /admin/v1/jobs/:jobName/start
```

Enables a scheduled job.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Path Parameters:**
- `jobName`: Name of the job to start

**Response:**
```json
{
  "message": "Job started successfully",
  "job": {
    "name": "database-optimization",
    "enabled": true,
    "nextRun": "2025-08-17T04:00:00.000Z"
  }
}
```

#### Stop Job

```
POST /admin/v1/jobs/:jobName/stop
```

Disables a scheduled job.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Path Parameters:**
- `jobName`: Name of the job to stop

**Response:**
```json
{
  "message": "Job stopped successfully",
  "job": {
    "name": "database-optimization",
    "enabled": false
  }
}
```

#### WebSocket Stats

```
GET /admin/v1/websocket/stats
```

Returns WebSocket connection statistics.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "connections": {
    "current": 542,
    "peak": 1254,
    "total": 15432
  },
  "messages": {
    "sent": 54321,
    "received": 12345,
    "errors": 32
  },
  "channels": {
    "match:123": 42,
    "team:456": 89
  }
}
```

#### Trigger Ingestion

```
POST /admin/v1/ingestion/trigger
```

Triggers data ingestion process.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "type": "fixtures",
  "options": {
    "date": "2025-08-15",
    "leagueIds": ["uuid-1", "uuid-2"],
    "forceRefresh": true
  }
}
```

**Response:**
```json
{
  "message": "Ingestion triggered successfully",
  "job": {
    "id": "uuid-string",
    "type": "fixtures",
    "status": "running"
  }
}
```

#### System Metrics

```
GET /admin/v1/metrics
```

Returns detailed system performance metrics.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Response:**
```json
{
  "timestamp": "2025-08-14T15:32:37.134Z",
  "system": {
    "uptime": 5065.165894779,
    "memory": {
      "rss": 82788352,
      "heapTotal": 34844672,
      "heapUsed": 32336272,
      "external": 4882425,
      "arrayBuffers": 4845491
    },
    "cpu": {
      "user": 136861224,
      "system": 267656007
    },
    "version": "v20.18.0",
    "platform": "darwin"
  },
  "jobs": [
    {
      "name": "daily-fixtures-ingestion",
      "schedule": "0 6 * * *",
      "enabled": true,
      "running": false
    },
    {
      "name": "live-fixtures-polling",
      "schedule": "*/2 * * * *",
      "enabled": true,
      "running": false,
      "lastRun": "2025-08-14T15:32:00.017Z",
      "nextRun": "2025-08-14T15:33:00.041Z"
    }
  ],
  "websocket": null
}
```

#### Test WebSocket

```
POST /admin/v1/websocket/test
```

Sends a test message to WebSocket clients.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "channel": "match:123",
  "event": "test_event",
  "data": {
    "message": "This is a test"
  }
}
```

**Response:**
```json
{
  "message": "WebSocket test message sent",
  "delivered": 42
}
```

#### Send Team Notification

```
POST /admin/v1/notifications/team
```

Sends a notification to followers of a specific team.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "teamId": "uuid-string",
  "title": "Match Postponed",
  "body": "Today's match against Chelsea has been postponed due to weather conditions.",
  "data": {
    "type": "postponement",
    "matchId": "uuid-string"
  }
}
```

**Response:**
```json
{
  "message": "Team notification queued",
  "targetUsers": 4231,
  "estimatedDelivery": "2025-08-14T15:40:00.000Z"
}
```

#### Send Stadium Guide Notification

```
POST /admin/v1/notifications/stadium-guide
```

Sends a notification about a stadium guide to relevant users.

**Headers:**
```
Authorization: Bearer {admin_access_token}
```

**Request Body:**
```json
{
  "venueId": "uuid-string",
  "matchId": "uuid-string",
  "title": "Emirates Stadium Guide",
  "body": "Check out our updated stadium guide for today's match."
}
```

**Response:**
```json
{
  "message": "Stadium guide notification queued",
  "targetUsers": 2153,
  "estimatedDelivery": "2025-08-14T15:45:00.000Z"
}
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication failed or token missing/expired
- `403 Forbidden`: Permission denied (e.g., non-admin accessing admin endpoints)
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server-side error

Error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific error about this field"
  }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Rate limits vary by endpoint:

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 300 requests per minute
- Admin endpoints: 500 requests per minute

When rate limited, the API returns status code `429 Too Many Requests` with headers indicating the limit and reset time.
