import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAnimeTrailer } from '../utils/movieSlice';
import { JIKAN_BASE_URL, API_ENDPOINTS, CACHE_KEYS } from '../utils/constants';
import { cacheUtils } from '../utils/cacheUtils';

const useAnimeTrailer = (animeId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!animeId) return;
      
      try {
        // Check cache first
        const cacheKey = CACHE_KEYS.ANIME_TRAILER(animeId);
        const cachedTrailer = cacheUtils.get(cacheKey);
        
        if (cachedTrailer) {
          dispatch(setAnimeTrailer(cachedTrailer));
          return;
        }

        await new Promise(resolve => setTimeout(resolve, 500));
        
        const res = await fetch(`${JIKAN_BASE_URL}/${API_ENDPOINTS.ANIME_DETAILS(animeId)}`);
        
        if (!res.ok) {
          dispatch(setAnimeTrailer(null));
          return;
        }
        
        const data = await res.json();
        
        if (data.data?.trailer?.embed_url) {
          // Cache the trailer data
          cacheUtils.set(cacheKey, data.data.trailer);
          dispatch(setAnimeTrailer(data.data.trailer));
        } else {
          dispatch(setAnimeTrailer(null));
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        dispatch(setAnimeTrailer(null));
      }
    };
    
    fetchTrailer();
  }, [animeId, dispatch]);
};

export default useAnimeTrailer; 