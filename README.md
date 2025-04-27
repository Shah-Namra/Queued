# Queued - Collaborative Music Playlist Application

Queued is a real-time collaborative music playlist application that allows users to create and join rooms where they can add, vote on, and manage songs together. The application features role-based access control, real-time synchronization, and seamless Spotify integration.

##  Features

### Core Features
- **User Authentication**: Secure JWT-based authentication system
- **Room Management**: Create and join rooms with unique codes
- **Role-Based Access**: Host and Joiner roles with different permissions
- **Real-Time Updates**: Instant synchronization of song queue and votes
- **Song Management**: Add, remove, and reorder songs in the queue
- **Voting System**: Upvote/downvote songs to influence playback order
- **Spotify Integration**: Seamless song search and playback

### Technical Features
- **WebSocket Support**: Real-time bidirectional communication
- **Database Transactions**: Atomic operations for data consistency
- **Error Handling**: Comprehensive error management and logging
- **Security**: JWT authentication, role-based access control
- **Scalability**: Designed for horizontal scaling

## 🛠 Tech Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Socket.IO Client**: Real-time communication
- **Spotify Web Playback SDK**: Music playback integration

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **Socket.IO**: Real-time bidirectional communication
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **pg**: PostgreSQL client for Node.js

##  Project Structure

### Frontend (`/src`)
```
src/
├── app/          # Next.js app router pages
├── components/   # Reusable React components
├── hooks/        # Custom React hooks
├── lib/          # Utility functions and configurations
└── styles/       # Global styles and Tailwind configuration
```

### Backend (`/queued-backend`)
```
queued-backend/
├── src/
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── middleware/   # Express middleware
│   ├── services/     # Business logic
│   └── db/          # Database configuration
├── package.json
└── .env.example
```

## 🔧 Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- Spotify Developer Account

### Backend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   cd queued-backend
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Set up the database:
   ```bash
   psql -U your_username -d your_database -f src/db/schema.sql
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd src
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

##  API Documentation

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `GET /api/auth/me`: Get current user profile

### Rooms
- `POST /api/rooms`: Create a new room
- `GET /api/rooms/:code`: Get room details
- `POST /api/rooms/:code/join`: Join a room
- `POST /api/rooms/:roomId/leave`: Leave a room
- `GET /api/rooms`: Get user's rooms

### Songs
- `POST /api/songs`: Add a song to queue
- `DELETE /api/songs/:songId`: Remove a song
- `POST /api/songs/:songId/vote`: Vote on a song
- `GET /api/songs/:songId`: Get song details
- `PUT /api/songs/reorder`: Reorder queue

## WebSocket Events

### Client to Server
- `join-room`: Join a room
- `add-song`: Add a song to queue
- `remove-song`: Remove a song
- `vote`: Vote on a song
- `reorder-queue`: Reorder the queue

### Server to Client
- `room-state`: Initial room state
- `song-added`: New song added
- `song-removed`: Song removed
- `vote-updated`: Vote count updated
- `queue-reordered`: Queue order changed
- `participant-joined`: New participant
- `participant-left`: Participant left
- `error`: Error messages

##  Security Features

### Authentication
- JWT-based authentication
- Token expiration and refresh
- Secure password hashing with bcrypt

### Authorization
- Role-based access control (Host/Joiner)
- Room-specific permissions
- WebSocket connection validation

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration

### Backend
- Database indexing
- Connection pooling
- Caching strategies
- Load balancing

### Frontend
- Code splitting
- Image optimization
- Lazy loading
- Service worker caching



##  Acknowledgments

- Spotify for their Web Playback SDK
- Socket.IO for real-time communication
- Next.js team for the amazing framework
- All contributors and maintainers
