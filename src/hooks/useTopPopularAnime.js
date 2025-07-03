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
        console.log('Fetching popular anime from:', JIKAN_TOP_POPULAR_URL);
        const res = await fetch(JIKAN_TOP_POPULAR_URL);
        const data = await res.json();
        console.log('Fetched data:', data);
        dispatch(addPopularAnime(data.data || []));
        console.log('Dispatched addPopularAnime');
      } catch (err) {
        setError('Failed to fetch anime.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [dispatch]);

  React.useEffect(() => {
    console.log('Redux anime state:', anime);
  }, [anime]);

  return { anime, loading, error };
}; 