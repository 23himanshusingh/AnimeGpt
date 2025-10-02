import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrailerId, setTrailerData, setTrailerLoading, setTrailerError } from '../utils/movieSlice';
import { JIKAN_BASE_URL, API_ENDPOINTS, CACHE_KEYS } from '../utils/constants';
import { getCachedData, setCachedData } from '../utils/cacheUtils';

const useAnimeTrailer = (animeId) => {
  const dispatch = useDispatch();
  const currentTrailerId = useSelector((store) => store.anime.currentTrailerId);
  const trailerData = useSelector((store) => store.anime.trailerData);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!animeId) return;
      
      dispatch(setTrailerLoading(true));
      dispatch(setTrailerError(null));
      try {
        // Check cache first
        const cacheKey = CACHE_KEYS.ANIME_TRAILER(animeId);
        const cachedTrailer = getCachedData(cacheKey);
        
        if (cachedTrailer) {
          dispatch(setCurrentTrailerId(animeId));
          dispatch(setTrailerData(cachedTrailer));
          dispatch(setTrailerLoading(false));
          return;
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const res = await fetch(`${JIKAN_BASE_URL}/${API_ENDPOINTS.ANIME_DETAILS(animeId)}`);
        
        if (!res.ok) {
          dispatch(setCurrentTrailerId(animeId));
          dispatch(setTrailerData(null));
          dispatch(setTrailerLoading(false));
          dispatch(setTrailerError('Failed to fetch trailer.'));
          return;
        }
        
        const data = await res.json();
        
        if (data.data?.trailer) {
          // Cache the trailer data (even if embed_url is missing)
          setCachedData(cacheKey, data.data.trailer);
          dispatch(setCurrentTrailerId(animeId));
          dispatch(setTrailerData(data.data.trailer));
        } else {
          dispatch(setCurrentTrailerId(animeId));
          dispatch(setTrailerData(null));
        }
        dispatch(setTrailerLoading(false));
      } catch (error) {
        console.error('Error fetching trailer:', error);
        dispatch(setCurrentTrailerId(animeId));
        dispatch(setTrailerData(null));
        dispatch(setTrailerLoading(false));
        dispatch(setTrailerError('Error fetching trailer.'));
      }
    };
    
    // Always fetch if animeId is different from current
    if (animeId !== currentTrailerId) {
      fetchTrailer();
    }
  }, [animeId, currentTrailerId, dispatch]);

  return { trailerData, currentTrailerId };
};

export default useAnimeTrailer; 