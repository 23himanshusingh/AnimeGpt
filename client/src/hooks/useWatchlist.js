import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWatchlist, addToWatchlist, removeFromWatchlist, setWatchlistLoading } from '../utils/movieSlice';
import { setWatchlistError } from '../utils/movieSlice';
import { BACKEND_URL } from '../utils/constants';

const API_URL = `${BACKEND_URL}/api/watchlist`;

const useWatchlist = () => {
  const dispatch = useDispatch();
  const watchlist = useSelector((store) => store.anime.watchlist);
  const watchlistLoading = useSelector((store) => store.anime.watchlistLoading);
  const watchlistError = useSelector((store) => store.anime.watchlistError);

  // Helper to get JWT
  const getToken = () => localStorage.getItem('token');

  // Fetch watchlist from backend
  const fetchWatchlist = useCallback(async () => {
    if (!getToken()) {
      dispatch(setWatchlist([]));
      return;
    }
    try {
      dispatch(setWatchlistLoading(true));
      dispatch(setWatchlistError(null));
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) throw new Error('Failed to fetch watchlist');
      const data = await response.json();
      dispatch(setWatchlist(data));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      dispatch(setWatchlist([]));
      dispatch(setWatchlistError('Could not connect to server.'));
    } finally {
      dispatch(setWatchlistLoading(false));
    }
  }, [dispatch]);

  // Add anime to watchlist
  const addAnimeToWatchlist = useCallback(async (anime) => {
    if (!getToken()) {
      console.warn('User not logged in');
      return;
    }
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(anime)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add to watchlist');
      }
      dispatch(addToWatchlist(anime));
      fetchWatchlist(); // Refresh
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      dispatch(setWatchlistError('Could not add to watchlist.'));
    }
  }, [dispatch, fetchWatchlist]);

  // Remove anime from watchlist
  const removeAnimeFromWatchlist = useCallback(async (animeId) => {
    if (!getToken()) {
      console.warn('User not logged in');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${animeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to remove from watchlist');
      }
      dispatch(removeFromWatchlist(animeId));
      fetchWatchlist(); // Refresh
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      dispatch(setWatchlistError('Could not remove from watchlist.'));
    }
  }, [dispatch, fetchWatchlist]);

  // Check if anime is in watchlist
  const isInWatchlist = useCallback((animeId) => {
    return watchlist.some(anime => anime.mal_id === animeId);
  }, [watchlist]);

  // Load watchlist on mount and when user changes
  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  return {
    watchlist,
    watchlistLoading,
    watchlistError,
    addAnimeToWatchlist,
    removeAnimeFromWatchlist,
    isInWatchlist,
    fetchWatchlist,
  };
};

export default useWatchlist; 