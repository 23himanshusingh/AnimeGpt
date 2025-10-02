// Cache utilities for localStorage with expiration
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Get cached data from localStorage
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export const getCachedData = (key) => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache has expired
    if (now - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

/**
 * Set data in localStorage with timestamp
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export const setCachedData = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error writing to cache:', error);
  }
};

/**
 * Clear specific cached item
 * @param {string} key - Cache key to remove
 */
export const clearCachedData = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Clear all cached data
 */
export const clearAllCachedData = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('search_') || key.startsWith('anime_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing all cache:', error);
  }
};

/**
 * Get cache statistics
 * @returns {object} - Cache statistics
 */
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => 
      key.startsWith('search_') || key.startsWith('anime_')
    );
    
    let totalSize = 0;
    let expiredCount = 0;
    const now = Date.now();

    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          totalSize += cached.length;
          
          if (now - timestamp > CACHE_EXPIRY) {
            expiredCount++;
          }
        }
      } catch {
        // Ignore parsing errors
      }
    });

    return {
      totalKeys: cacheKeys.length,
      expiredKeys: expiredCount,
      totalSize: totalSize,
      cacheExpiry: CACHE_EXPIRY,
    };
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return null;
  }
}; 