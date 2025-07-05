// Cache utilities for localStorage
const CACHE_PREFIX = 'animegpt_cache_';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

export const cacheUtils = {
  // Set cache with expiration
  set: (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + CACHE_EXPIRY
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  },

  // Get cache if not expired
  get: (key) => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      const now = Date.now();

      if (now > cacheData.expiry) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return cacheData.data;
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  },

  // Clear specific cache
  clear: (key) => {
    try {
      localStorage.removeItem(CACHE_PREFIX + key);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },

  // Clear all cache
  clearAll: () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  },

  // Check if cache exists and is valid
  has: (key) => {
    return cacheUtils.get(key) !== null;
  }
}; 