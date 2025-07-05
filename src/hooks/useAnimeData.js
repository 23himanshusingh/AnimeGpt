import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addTopAiringAnime, 
  addNowPlayingAnime, 
  addTopRatedAnime, 
  addTopAnimeMovies 
} from '../utils/movieSlice';
import { JIKAN_BASE_URL, API_ENDPOINTS, API_DELAY, CACHE_KEYS } from '../utils/constants';
import { cacheUtils } from '../utils/cacheUtils';

const useAnimeData = () => {
  const dispatch = useDispatch();

  const fetchAnimeData = useCallback(async (endpoint, action, cacheKey) => {
    try {
      // Check cache first
      const cachedData = cacheUtils.get(cacheKey);
      if (cachedData) {
        dispatch(action(cachedData));
        return;
      }

      const response = await fetch(`${JIKAN_BASE_URL}/${endpoint}`);
      
      if (!response.ok) {
        console.error(`Error fetching ${endpoint}:`, response.status);
        return;
      }
      
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Cache the data
        cacheUtils.set(cacheKey, data.data);
        dispatch(action(data.data));
      }
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  }, [dispatch]);

  useEffect(() => {
    const endpoints = [
      { url: API_ENDPOINTS.TOP_AIRING, action: addTopAiringAnime, cacheKey: CACHE_KEYS.TOP_AIRING },
      { url: API_ENDPOINTS.NOW_PLAYING, action: addNowPlayingAnime, cacheKey: CACHE_KEYS.NOW_PLAYING },
      { url: API_ENDPOINTS.TOP_RATED, action: addTopRatedAnime, cacheKey: CACHE_KEYS.TOP_RATED },
      { url: API_ENDPOINTS.TOP_MOVIES, action: addTopAnimeMovies, cacheKey: CACHE_KEYS.TOP_MOVIES }
    ];

    const promises = endpoints.map((endpoint, index) => 
      new Promise(resolve => {
        setTimeout(async () => {
          await fetchAnimeData(endpoint.url, endpoint.action, endpoint.cacheKey);
          resolve();
        }, index * API_DELAY);
      })
    );

    Promise.all(promises).catch(error => {
      console.error('Error fetching anime data:', error);
    });
  }, [fetchAnimeData]);
};

export default useAnimeData; 