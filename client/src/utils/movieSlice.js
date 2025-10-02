import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Anime data
  topAiringAnime: [],
  nowPlayingAnime: [],
  topRatedAnime: [],
  topAnimeMovies: [],
  
  // Global trailer state - simple and clean
  currentTrailerId: null,
  trailerData: null,
  trailerLoading: false,
  trailerError: null,
  
  // Search
  searchResults: [],
  searchLoading: false,
  
  // Selected anime details
  selectedAnime: null,
  recommendations: [],
  detailsLoading: false,
  
  // Watchlist - will be managed by Firestore
  watchlist: [],
  watchlistLoading: false,
  watchlistError: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    // Anime data actions
    addTopAiringAnime: (state, action) => {
      state.topAiringAnime = action.payload;
    },
    addNowPlayingAnime: (state, action) => {
      state.nowPlayingAnime = action.payload;
    },
    addTopRatedAnime: (state, action) => {
      state.topRatedAnime = action.payload;
    },
    addTopAnimeMovies: (state, action) => {
      state.topAnimeMovies = action.payload;
    },
    
    // Trailer actions - improved with loading and error state
    setCurrentTrailerId: (state, action) => {
      state.currentTrailerId = action.payload;
    },
    setTrailerData: (state, action) => {
      state.trailerData = action.payload;
    },
    setTrailerLoading: (state, action) => {
      state.trailerLoading = action.payload;
    },
    setTrailerError: (state, action) => {
      state.trailerError = action.payload;
    },
    clearTrailer: (state) => {
      state.currentTrailerId = null;
      state.trailerData = null;
      state.trailerLoading = false;
      state.trailerError = null;
    },
    
    // Search actions
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchLoading: (state, action) => {
      state.searchLoading = action.payload;
    },
    
    // Anime details actions
    setSelectedAnime: (state, action) => {
      state.selectedAnime = action.payload;
    },
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setDetailsLoading: (state, action) => {
      state.detailsLoading = action.payload;
    },
    clearAnimeDetails: (state) => {
      state.selectedAnime = null;
      state.recommendations = [];
    },
    
    // Watchlist actions - synced with Firestore
    setWatchlist: (state, action) => {
      state.watchlist = action.payload;
    },
    addToWatchlist: (state, action) => {
      if (!state.watchlist.find(anime => anime.mal_id === action.payload.mal_id)) {
        state.watchlist.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action) => {
      state.watchlist = state.watchlist.filter(anime => anime.mal_id !== action.payload);
    },
    setWatchlistLoading: (state, action) => {
      state.watchlistLoading = action.payload;
    },
    setWatchlistError: (state, action) => {
      state.watchlistError = action.payload;
    },
  },
});

export const { 
  // Anime data
  addTopAiringAnime, 
  addNowPlayingAnime, 
  addTopRatedAnime, 
  addTopAnimeMovies, 
  
  // Trailer
  setCurrentTrailerId,
  setTrailerData,
  setTrailerLoading,
  setTrailerError,
  clearTrailer,
  
  // Search
  setSearchResults,
  setSearchLoading,
  
  // Anime details
  setSelectedAnime,
  setRecommendations,
  setDetailsLoading,
  clearAnimeDetails,
  
  // Watchlist
  setWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  setWatchlistLoading,
  setWatchlistError,
} = animeSlice.actions;

export default animeSlice.reducer; 