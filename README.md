# AnimeGPT - Netflix-Style Anime Streaming Platform

A modern anime streaming platform built with React, Redux, Node.js, Express, and MongoDB, featuring a Netflix-style interface and comprehensive anime discovery features.

## Features

### 🔐 Authentication
- **JWT-based Authentication**: Secure user authentication with JWT tokens (7-day expiration)
- **User Registration & Login**: Email/password-based authentication with bcrypt hashing
- **Session Management**: Automatic token validation and user session persistence
- **Protected Routes**: Middleware-based route protection for authenticated users
- **Form Validation**: Client-side validation for email, password, and username

### 🎬 Anime Discovery
- **Hero Section**: Featured anime with video background trailers
- **Multiple Categories**: Top Airing, Now Playing, Top Rated, and Top Anime Movies
- **Horizontal Scrolling**: Netflix-style anime rows with smooth scrolling
- **Responsive Design**: Optimized for desktop and mobile devices

### 🔍 Advanced Search & Recommendations
- **Debounced Search**: Real-time search with 500ms debouncing
- **Autocomplete**: Dropdown with anime suggestions as you type
- **Detailed Anime View**: Comprehensive anime information including:
  - High-quality poster and background images
  - Synopsis and detailed description
  - Genre tags and ratings
  - Episode count and duration
  - Release information
- **Smart Recommendations**: AI-powered anime suggestions based on selected anime
- **Caching System**: Local storage caching to reduce API calls and improve performance

### 📋 Watchlist Management
- **Personal Watchlist**: Add/remove anime to your personal collection
- **MongoDB Integration**: Cloud-based watchlist storage with Mongoose ODM
- **Real-time Sync**: Instant updates across devices
- **Watchlist View**: Dedicated page to manage your saved anime
- **Status Tracking**: Track watching status (Watching, Completed, On-Hold, Dropped, Plan to Watch)
- **User Ratings**: Rate anime on a 0-10 scale
- **Duplicate Prevention**: Automatic duplicate detection when adding anime

### 🎥 Video Integration
- **YouTube Trailer Integration**: Autoplay muted trailers in hero section
- **Video Background**: Netflix-style video backgrounds for featured anime
- **Responsive Video**: Optimized video playback across devices

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS 4
- **Icons**: React Icons
- **HTTP Client**: Fetch API with proxy configuration
- **Build Tool**: Vite with React plugin

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) with bcryptjs
- **CORS**: Cross-origin resource sharing enabled
- **Environment**: dotenv for configuration management

### External APIs
- **Anime Data**: Jikan API (MyAnimeList) v4
- **Video Integration**: YouTube Embed API

## Project Structure

```
netflix-gpt/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── AnimeCard.jsx        # Individual anime card component
│   │   ├── AnimeDetails.jsx     # Detailed anime view
│   │   ├── AnimeList.jsx        # Horizontal scrolling anime lists
│   │   ├── Browse.jsx           # Main browsing page
│   │   ├── ErrorBoundary.jsx    # Error boundary component
│   │   ├── Header.jsx           # Navigation header
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── Login.jsx            # Authentication page
│   │   ├── MainContainer.jsx    # Hero section container
│   │   ├── Search.jsx           # Search functionality
│   │   ├── SearchBar.jsx        # Search input component
│   │   ├── SecondaryContainer.jsx # Anime categories container
│   │   ├── VideoBackground.jsx  # Video background component
│   │   ├── VideoTitle.jsx       # Hero section title
│   │   └── Watchlist.jsx        # Watchlist management
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAnimeData.js      # Anime data fetching
│   │   ├── useAnimeDetails.js   # Anime details fetching
│   │   ├── useAnimeSearch.js    # Search functionality
│   │   ├── useAnimeTrailer.js   # Trailer fetching
│   │   └── useWatchlist.js      # Watchlist management
│   ├── utils/                   # Utility functions
│   │   ├── cacheUtils.js        # Local storage caching
│   │   ├── constants.js         # API endpoints and constants
│   │   ├── movieSlice.js        # Redux anime slice
│   │   ├── store.js             # Redux store configuration
│   │   └── userSlice.js         # Redux user slice
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── server/                      # Backend Node.js application
│   ├── controllers/             # Route controllers
│   │   ├── authController.js    # Authentication logic
│   │   └── watchlistController.js # Watchlist management
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/                  # Mongoose models
│   │   ├── User.js              # User schema
│   │   └── Watchlist.js         # Watchlist schema
│   ├── routes/                  # Express routes
│   │   ├── auth.js              # Authentication routes
│   │   └── watchlist.js         # Watchlist routes
│   ├── index.js                 # Server entry point
│   └── package.json             # Backend dependencies
├── package.json                 # Frontend dependencies
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user (email, password)
- `POST /api/auth/login` - User login (email, password)
- `GET /api/auth/me` - Get current user info (protected)

### Watchlist Endpoints (Protected)
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add anime to watchlist
- `PUT /api/watchlist/:mal_id` - Update anime status/rating
- `DELETE /api/watchlist/:mal_id` - Remove anime from watchlist

### External API Integration
- **Jikan API**: `https://api.jikan.moe/v4`
  - Top Airing: `/top/anime?filter=airing`
  - Now Playing: `/seasons/now`
  - Top Rated: `/top/anime?filter=bypopularity`
  - Top Movies: `/top/anime?type=movie`
  - Anime Details: `/anime/:id`
  - Recommendations: `/anime/:id/recommendations`

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to project root**
   ```bash
   cd ..
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` and automatically proxy API requests to the backend on `http://localhost:5000`.

## Usage Flow

1. **User Authentication**: Register or login with email/password
2. **Browse Anime**: Explore featured anime and different categories
3. **Search Anime**: Use the search bar to find specific anime
4. **View Details**: Click on any anime to see detailed information
5. **Add to Watchlist**: Save anime to your personal watchlist
6. **Get Recommendations**: Discover similar anime based on your selections
7. **Manage Watchlist**: View and manage your saved anime collection

## Performance Features

- **Debounced Search**: Reduces API calls during typing (500ms delay)
- **Local Storage Caching**: Caches API responses for 30 minutes
- **Lazy Loading**: Optimized image loading with placeholder fallbacks
- **Rate Limiting**: Built-in API rate limiting protection (800ms between calls)
- **Error Boundaries**: Graceful error handling with React Error Boundaries
- **Proxy Configuration**: Automatic API proxying for development

## Development Features

- **Hot Reload**: Vite-based development with instant updates
- **ESLint**: Code linting with React-specific rules
- **Proxy Configuration**: Automatic API proxying for development
- **Environment Variables**: Secure configuration management
- **TypeScript Ready**: Project structure supports TypeScript migration
- **Error Handling**: Comprehensive error handling throughout the application

## Deployment

### Backend Deployment
- Deploy to platforms like Heroku, Railway, or DigitalOcean
- Set environment variables for production
- Ensure MongoDB connection string is configured
- Configure CORS for production domain

### Frontend Deployment
- Build the project: `npm run build`
- Deploy the `dist` folder to platforms like Vercel, Netlify, or Firebase Hosting
- Configure environment variables for production API endpoints
- Update proxy configuration for production

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Test thoroughly (frontend and backend)
5. Submit a pull request

## License

This project is licensed under the MIT License.
