import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedAnime, setRecommendations, setDetailsLoading, clearAnimeDetails } from '../utils/movieSlice';
import { JIKAN_BASE_URL, API_ENDPOINTS, CACHE_KEYS } from '../utils/constants';
import { getCachedData, setCachedData } from '../utils/cacheUtils';

const useAnimeDetails = () => {
  const dispatch = useDispatch();

  const fetchAnimeDetails = useCallback(async (animeId) => {
    if (!animeId) return;

    try {
      dispatch(setDetailsLoading(true));

      // Check cache first
      const cacheKey = CACHE_KEYS.ANIME_DETAILS(animeId);
      const cachedDetails = getCachedData(cacheKey);
      
      if (cachedDetails) {
        dispatch(setSelectedAnime(cachedDetails.anime));
        dispatch(setRecommendations(cachedDetails.recommendations));
        dispatch(setDetailsLoading(false));
        return;
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));

      // Fetch anime details
      const detailsRes = await fetch(`${JIKAN_BASE_URL}/${API_ENDPOINTS.ANIME_DETAILS(animeId)}`);
      
      if (!detailsRes.ok) {
        dispatch(setDetailsLoading(false));
        return;
      }

      const detailsData = await detailsRes.json();
      const anime = detailsData.data;

      // Fetch recommendations
      const recommendationsRes = await fetch(`${JIKAN_BASE_URL}/${API_ENDPOINTS.ANIME_DETAILS(animeId)}/recommendations`);
      
      let recommendations = [];
      if (recommendationsRes.ok) {
        const recommendationsData = await recommendationsRes.json();
        recommendations = recommendationsData.data.slice(0, 10).map(rec => rec.entry);
      }

      // Cache the data
      const dataToCache = { anime, recommendations };
      setCachedData(cacheKey, dataToCache);

      dispatch(setSelectedAnime(anime));
      dispatch(setRecommendations(recommendations));
    } catch (error) {
      console.error('Error fetching anime details:', error);
    } finally {
      dispatch(setDetailsLoading(false));
    }
  }, [dispatch]);

  const clearAnimeDetailsData = useCallback(() => {
    dispatch(clearAnimeDetails());
  }, [dispatch]);

  return {
    fetchAnimeDetails,
    clearAnimeDetails: clearAnimeDetailsData,
  };
};

export default useAnimeDetails; 