# AnimeGPT - Netflix-Style Anime Streaming Platform

A modern anime streaming platform built with React, Redux, Tailwind CSS, and Firebase, featuring a Netflix-style interface and comprehensive anime discovery features.

## Features

### 🔐 Authentication
- Google OAuth integration with Firebase
- Secure user session management
- Automatic profile creation with avatar generation

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
- **Firestore Integration**: Cloud-based watchlist storage
- **Real-time Sync**: Instant updates across devices
- **Watchlist View**: Dedicated page to manage your saved anime

### 🎥 Video Integration
- **YouTube Trailer Integration**: Autoplay muted trailers in hero section
- **Video Background**: Netflix-style video backgrounds for featured anime
- **Responsive Video**: Optimized video playback across devices

## Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router DOM
- **Styling**: Tailwind CSS 4
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **API**: Jikan API (MyAnimeList)
- **Icons**: React Icons
- **Build Tool**: Vite

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netflix-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Update Firebase configuration in `src/utils/firebase.js`

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage Flow

1. **User Authentication**: Sign in with Google account
2. **Browse Anime**: Explore featured anime and different categories
3. **Search Anime**: Use the search bar to find specific anime
4. **View Details**: Click on any anime to see detailed information
5. **Add to Watchlist**: Save anime to your personal watchlist
6. **Get Recommendations**: Discover similar anime based on your selections
7. **Manage Watchlist**: View and manage your saved anime collection

## API Integration

The app integrates with the Jikan API (MyAnimeList) for:
- Anime search and discovery
- Detailed anime information
- Recommendations and related anime
- Trailer and video data

## Performance Features

- **Debounced Search**: Reduces API calls during typing
- **Local Storage Caching**: Caches API responses for 30 minutes
- **Lazy Loading**: Optimized image loading
- **Rate Limiting**: Built-in API rate limiting protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
