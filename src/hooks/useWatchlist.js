import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { collection, addDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { setWatchlist, addToWatchlist, removeFromWatchlist, setWatchlistLoading } from '../utils/movieSlice';
import { setWatchlistError } from '../utils/movieSlice';

const useWatchlist = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user?.user);
  const watchlist = useSelector((store) => store.anime.watchlist);
  const watchlistLoading = useSelector((store) => store.anime.watchlistLoading);
  const watchlistError = useSelector((store) => store.anime.watchlistError);

  // Fetch watchlist from Firestore
  const fetchWatchlist = useCallback(async () => {
    if (!user?.uid) {
      dispatch(setWatchlist([]));
      return;
    }

    try {
      dispatch(setWatchlistLoading(true));
      dispatch(setWatchlistError(null));
      
      const watchlistRef = collection(db, 'watchlists');
      const q = query(watchlistRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const userWatchlist = [];
      querySnapshot.forEach((doc) => {
        userWatchlist.push(doc.data().anime);
      });
      
      dispatch(setWatchlist(userWatchlist));
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      dispatch(setWatchlist([]));
      dispatch(setWatchlistError('Could not connect to database.'));
    } finally {
      dispatch(setWatchlistLoading(false));
    }
  }, [user?.uid, dispatch]);

  // Add anime to watchlist
  const addAnimeToWatchlist = useCallback(async (anime) => {
    if (!user?.uid) {
      console.warn('User not logged in');
      return;
    }

    try {
      const watchlistRef = collection(db, 'watchlists');
      await addDoc(watchlistRef, {
        userId: user.uid,
        anime: anime,
        addedAt: new Date().toISOString(),
      });
      
      dispatch(addToWatchlist(anime));
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      dispatch(setWatchlistError('Could not add to watchlist.'));
    }
  }, [user?.uid, dispatch]);

  // Remove anime from watchlist
  const removeAnimeFromWatchlist = useCallback(async (animeId) => {
    if (!user?.uid) {
      console.warn('User not logged in');
      return;
    }

    try {
      const watchlistRef = collection(db, 'watchlists');
      const q = query(
        watchlistRef, 
        where('userId', '==', user.uid),
        where('anime.mal_id', '==', animeId)
      );
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      
      dispatch(removeFromWatchlist(animeId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      dispatch(setWatchlistError('Could not remove from watchlist.'));
    }
  }, [user?.uid, dispatch]);

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