import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { 
  getPersonalizedRecommendations, 
  getContentBasedRecommendations,
  getCollaborativeRecommendations,
  getHybridRecommendations 
} from '../utils/recommendationEngine';

const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendationType, setRecommendationType] = useState('hybrid'); // 'content', 'collaborative', 'hybrid'

  const { watchlist } = useSelector(store => store.anime);
  const { topRatedAnime, topAiringAnime, nowPlayingAnime, topAnimeMovies } = useSelector(store => store.anime);
  const user = useSelector(store => store.user.user);

  // Combine all available anime data
  const getAllAnime = useCallback(() => {
    const allAnime = [
      ...(topRatedAnime || []),
      ...(topAiringAnime || []),
      ...(nowPlayingAnime || []),
      ...(topAnimeMovies || [])
    ];
    
    // Remove duplicates based on mal_id
    const uniqueAnime = allAnime.filter((anime, index, self) => 
      index === self.findIndex(a => a.mal_id === anime.mal_id)
    );
    
    return uniqueAnime;
  }, [topRatedAnime, topAiringAnime, nowPlayingAnime, topAnimeMovies]);

  // Get recommendations based on selected type
  const getRecommendations = useCallback(async (type = recommendationType, limit = 10) => {
    if (!user || !watchlist || watchlist.length === 0) {
      setRecommendations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allAnime = getAllAnime();
      console.log('AI Recommendations Debug:', {
        user: user?.id,
        watchlistLength: watchlist?.length,
        allAnimeLength: allAnime.length,
        recommendationType: type
      });
      
      let recs = [];

      switch (type) {
        case 'content':
          recs = getContentBasedRecommendations(watchlist, allAnime, limit);
          break;
        case 'collaborative':
          // For collaborative filtering, we'd need other users' data
          // For now, fall back to content-based
          recs = getContentBasedRecommendations(watchlist, allAnime, limit);
          break;
        case 'hybrid':
        default:
          // Create user ratings from watchlist for collaborative filtering
          const userRatings = {};
          watchlist.forEach(anime => {
            if (anime.userRating && anime.userRating > 0) {
              userRatings[anime.mal_id] = anime.userRating;
            }
          });
          
          recs = getHybridRecommendations(
            { id: user.id, ratings: userRatings },
            [], // Mock other users for now - in real app, fetch from backend
            watchlist,
            allAnime,
            limit
          );
          break;
      }

      // Enhance recommendations with anime data and reasons
      const enhancedRecs = recs.map(rec => {
        const anime = allAnime.find(a => a.mal_id === parseInt(rec.animeId));
        return {
          ...rec,
          anime: anime,
          reason: getRecommendationReason(rec, watchlist, anime)
        };
      }).filter(rec => rec.anime); // Filter out recommendations without anime data

      // If no recommendations found, provide fallback recommendations
      if (enhancedRecs.length === 0 && allAnime.length > 0) {
        const fallbackRecs = allAnime
          .filter(anime => !watchlist.find(w => w.mal_id === anime.mal_id))
          .slice(0, limit)
          .map(anime => ({
            animeId: anime.mal_id,
            score: anime.score || 7.0,
            confidence: 0.5,
            anime: anime,
            reason: 'Popular anime you might enjoy'
          }));
        setRecommendations(fallbackRecs);
      } else {
        setRecommendations(enhancedRecs);
      }
    } catch (err) {
      console.error('Error getting AI recommendations:', err);
      setError('Failed to load personalized recommendations');
    } finally {
      setLoading(false);
    }
  }, [user, watchlist, getAllAnime, recommendationType]);

  // Generate recommendation reason
  const getRecommendationReason = useCallback((recommendation, userWatchlist, anime) => {
    if (!anime || !userWatchlist) return 'Based on your preferences';
    
    const userGenres = new Set();
    userWatchlist.forEach(watchlistAnime => {
      if (watchlistAnime.genres) {
        watchlistAnime.genres.forEach(genre => userGenres.add(genre.name));
      }
    });
    
    const commonGenres = anime.genres?.filter(genre => userGenres.has(genre.name)) || [];
    
    if (commonGenres.length > 0) {
      return `Because you like ${commonGenres.slice(0, 2).map(g => g.name).join(' and ')} anime`;
    }
    
    if (anime.score && anime.score > 8) {
      return 'Highly rated anime that matches your taste';
    }
    
    return 'Based on your watching patterns';
  }, []);

  // Refresh recommendations
  const refreshRecommendations = useCallback(() => {
    getRecommendations();
  }, [getRecommendations]);

  // Change recommendation type
  const changeRecommendationType = useCallback((type) => {
    setRecommendationType(type);
    getRecommendations(type);
  }, [getRecommendations]);

  // Get user preference insights
  const getUserInsights = useCallback(() => {
    if (!watchlist || watchlist.length === 0) return null;

    const genreCounts = {};
    const typeCounts = {};
    const totalAnime = watchlist.length;

    watchlist.forEach(anime => {
      if (anime.genres) {
        anime.genres.forEach(genre => {
          genreCounts[genre.name] = (genreCounts[genre.name] || 0) + 1;
        });
      }
      if (anime.type) {
        typeCounts[anime.type] = (typeCounts[anime.type] || 0) + 1;
      }
    });

    // Get top genres
    const topGenres = Object.entries(genreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / totalAnime) * 100)
      }));

    // Get top types
    const topTypes = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / totalAnime) * 100)
      }));

    return {
      totalAnime,
      topGenres,
      topTypes,
      averageRating: watchlist.reduce((sum, anime) => sum + (anime.userRating || 0), 0) / totalAnime
    };
  }, [watchlist]);

  // Load recommendations when dependencies change
  useEffect(() => {
    if (user && watchlist && watchlist.length > 0) {
      getRecommendations();
    }
  }, [user, watchlist, getRecommendations]);

  return {
    recommendations,
    loading,
    error,
    recommendationType,
    refreshRecommendations,
    changeRecommendationType,
    getUserInsights,
    getRecommendations
  };
};

export default useAIRecommendations;
