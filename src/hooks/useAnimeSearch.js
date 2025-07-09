import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchResults, setSearchLoading } from '../utils/movieSlice';
import { getCachedData, setCachedData } from '../utils/cacheUtils';

const useAnimeSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const dispatch = useDispatch();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search anime when debounced term changes
  useEffect(() => {
    if (!debouncedTerm.trim()) {
      dispatch(setSearchResults([]));
      dispatch(setSearchLoading(false));
      return;
    }

    const searchAnime = async () => {
      dispatch(setSearchLoading(true));
      
      try {
        // Check cache first
        const cacheKey = `search_${debouncedTerm.toLowerCase()}`;
        const cachedResults = getCachedData(cacheKey);
        
        if (cachedResults) {
          dispatch(setSearchResults(cachedResults));
          dispatch(setSearchLoading(false));
          return;
        }

        // Fetch from API
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(debouncedTerm)}&limit=10&sfw`
        );
        
        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        const results = data.data || [];
        
        // Cache the results
        setCachedData(cacheKey, results);
        
        dispatch(setSearchResults(results));
      } catch (error) {
        console.error('Search error:', error);
        dispatch(setSearchResults([]));
      } finally {
        dispatch(setSearchLoading(false));
      }
    };

    searchAnime();
  }, [debouncedTerm, dispatch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    dispatch(setSearchResults([]));
  }, [dispatch]);

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
  };
};

export default useAnimeSearch; 