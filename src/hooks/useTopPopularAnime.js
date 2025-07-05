import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JIKAN_TOP_POPULAR_URL } from '../utils/constants';
import { addPopularAnime } from '../utils/movieSlice';

export const useTopPopularAnime = () => {
  const dispatch = useDispatch();
  const anime = useSelector((state) => state.anime.popularAnime);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(JIKAN_TOP_POPULAR_URL);
        const data = await res.json();
        dispatch(addPopularAnime(data.data || []));
      } catch {
        setError('Failed to fetch anime.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [dispatch]);

  return { anime, loading, error };
}; 