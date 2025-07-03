import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAnimeTrailer } from '../utils/movieSlice';

const useAnimeTrailer = (animeId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!animeId) return;
      try {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await res.json();
        // Jikan's trailer object has embed_url and url (YouTube)
        dispatch(setAnimeTrailer(data.data?.trailer || null));
      } catch {
        dispatch(setAnimeTrailer(null));
      }
    };
    fetchTrailer();
  }, [animeId, dispatch]);
};

export default useAnimeTrailer; 