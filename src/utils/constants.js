export const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// API Endpoints
export const API_ENDPOINTS = {
  TOP_AIRING: 'top/anime?filter=airing',
  NOW_PLAYING: 'seasons/now',
  TOP_RATED: 'top/anime?filter=bypopularity',
  TOP_MOVIES: 'top/anime?type=movie',
  ANIME_DETAILS: (id) => `anime/${id}`,
};

// API Rate Limiting
export const API_DELAY = 800; // milliseconds between API calls

// Cache Settings
export const CACHE_KEYS = {
  TOP_AIRING: 'top_airing_anime',
  NOW_PLAYING: 'now_playing_anime',
  TOP_RATED: 'top_rated_anime',
  TOP_MOVIES: 'top_movies_anime',
  ANIME_TRAILER: (id) => `anime_trailer_${id}`,
  ANIME_DETAILS: (id) => `anime_details_${id}`,
};

// YouTube Player Settings
export const YOUTUBE_PLAYER_CONFIG = {
  autoplay: 1,
  mute: 1,
  controls: 0,
  loop: 1,
  rel: 0,
  modestbranding: 1,
  showinfo: 0,
};

// CSS Classes
export const CSS_CLASSES = {
  SCROLLBAR_HIDE: 'scrollbar-hide',
  LINE_CLAMP_2: 'line-clamp-2',
  LINE_CLAMP_3: 'line-clamp-3',
};

// Placeholder Images
export const PLACEHOLDER_IMAGES = {
  ANIME_CARD: 'https://via.placeholder.com/300x400/1f2937/ffffff?text=No+Image',
};

 